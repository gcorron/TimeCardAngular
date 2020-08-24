using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using TimeCard.Domain;
using TimeCard.Repo.Repos;
using TimeCardAngular.Models;
using TimeCardCore.Infrastructure;
using OfficeOpenXml;
using ICSharpCode.SharpZipLib.Zip;

namespace TimeCardAngular.Controllers
{
    [Authorize("Contractor", "Write")]
    [Route("api/[controller]")]
    [ApiController]
    public class WorkController : BaseController
    {

        private WorkRepo _WorkRepo { get; set; }
        private JobRepo _JobRepo { get; set; }
        private AppUserRepo _AppUserRepo { get; set; }
        private PaymentRepo _PaymentRepo { get; set; }
        public WorkController(IConfiguration config, IWebHostEnvironment webHostEnvironment, IHttpContextAccessor httpContextAccessor) : base(config, webHostEnvironment, httpContextAccessor)
        {
            _WorkRepo = new WorkRepo(ConnString);
            _JobRepo = new JobRepo(ConnString);
            _AppUserRepo = new AppUserRepo(ConnString);
            _PaymentRepo = new PaymentRepo(ConnString);
        }

        [Route("Jobs")]
        [HttpGet]
        public IActionResult Jobs(int cycle)
        {
            var jobs = _JobRepo.GetJobsForWork(ContractorId, cycle).Select(x => new SelectListItem { Text = x.Descr, Value = x.Id.ToString() });
            return Ok(jobs);
        }

        [Route("Cycles")]
        [HttpGet]
        public IActionResult Cycles()
        {
            return Ok(GetPayCycles());
        }

        [Route("Summary")]
        [HttpGet]
        public ActionResult WorkSummary()
        {
            var summary = _WorkRepo.GetWorkSummary(ContractorId).OrderBy(x => x.WorkPeriod).ThenBy(x => x.Descr);
            return Ok(summary);
        }

        [Route("SummaryJob")]
        [HttpGet]
        public ActionResult WorkSummaryJob()
        {
            var summary = _WorkRepo.GetWorkSummary(ContractorId).OrderBy(x => x.Descr).ThenBy(x => x.WorkPeriod);
            return Ok(summary);
        }

        [Route("DetailJob")]
        [HttpGet]
        public ActionResult WorkDetailJob(int jobId)
        {
            var detail = _WorkRepo.GetWorkJobDetail(ContractorId, jobId);
            return Ok(detail);
        }

        [Route("Edit")]
        [HttpGet]
        public ActionResult Edit()
        {
            var vm = new Models.WorkViewModel();
            vm.SelectedCycle = DateRef.CurrentWorkCycle;
            prepWork(vm);
            return Ok(vm);

        }

        [Route("Save")]
        [HttpPost]
        public ActionResult Edit(Work work)
        {
            _WorkRepo.SaveWork(work);
            var vm = new Models.WorkViewModel();
            vm.SelectedCycle = (int)Math.Floor(work.WorkDay);
            prepWork(vm);
            return Ok(vm);
        }

        [Route("Delete")]
        [HttpDelete]
        public ActionResult Delete(int workId, decimal workDay)
        {
            _WorkRepo.DeleteWork(workId);
            var vm = new Models.WorkViewModel();
            vm.SelectedCycle = (int)Math.Floor(workDay);
            prepWork(vm);
            return Ok(vm);
        }

        [Route("Generate")]
        [HttpGet]
        public ActionResult GenerateDocs(int cycle)
        {
            var templateFile = new FileInfo($"{WebRootPath}\\Content\\TimeCardTemplates.xlsx");

            try
            {
                string name = LookupRepo.GetLookups("Contractor").Where(x => x.Id == ContractorId).FirstOrDefault()?.Descr;

                var fileList = new List<string>();
                GenerateTimeCards(ContractorId, name, templateFile, cycle, fileList);
                GenerateTimeBooks(ContractorId, name, templateFile, cycle, fileList);
                GenerateInvoices(ContractorId, name, templateFile, cycle, fileList);
                GenerateSummary(ContractorId, name, templateFile, cycle, fileList);
                if (!fileList.Any())
                {
                    return Ok(new { success = false, message = "Nothing to generate.",fileName = "", fileList = Enumerable.Empty<string>() });
                }


                string zipFile = $"C:\\TEMP\\{name}.zip";
                return Ok(new { success = true, message = "OK", fileName = zipFile, fileList } );
            }
            catch (Exception ex)
            {
                return Ok(new { success = false, message = ex.Message, fileName = "", fileList = Enumerable.Empty<string>() });
            }

        }

        private void GenerateTimeCards(int contractorId, string name, FileInfo templateFile, int cycle, List<string> fileList)
        {
            const int blankRow = 11;

            var workEntries = _WorkRepo.GetWorkExtended(contractorId, cycle, true).Where(x => x.BillType == "TC")
                .GroupBy(g => new { g.ClientId, g.ProjectId });


            using (var templatePackage = new ExcelPackage(templateFile))
            {
                var templateSheet = templatePackage.Workbook.Worksheets["TimeCard"];

                foreach (var tc in workEntries)
                {
                    //create a new time card and populate it

                    string endDate = new TimeCard.Domain.WorkExtended { WorkDay = (decimal)cycle }.CycleEndDate;

                    var file = new FileInfo($"C:\\TEMP\\FWSI_TC_{endDate.Replace("/", "")}_{name}_{tc.First().Client}_{tc.First().Project.Replace("/", "")}.xlsx");
                    System.IO.File.Delete(file.FullName);
                    ExcelWorksheet sheet = null;
                    using (var package = new ExcelPackage(file))
                    {
                        var workBook = package.Workbook;
                        var first = tc.First();
                        int[] currentRow = { blankRow + 1, blankRow + 1 };
                        var tcWeek = tc.GroupBy(w => new { tabName = $"{ w.Project.Replace("/", "")} Week {w.WorkWeek + 1}", weekDate = w.WorkWeekDate, week = w.WorkWeek });
                        foreach (var week in tcWeek)
                        {
                            sheet = workBook.Worksheets.Add(week.Key.tabName, templateSheet);
                            sheet.Cells[7, 9].Value = week.Key.weekDate;
                            sheet.Cells[7, 5].Value = first.Client;
                            sheet.Cells[7, 1].Value = first.Contractor;
                            sheet.Cells[14, 5].Value = first.Contractor;
                            sheet.Cells[14, 10].Value = DateTime.Today;
                        }
                        foreach (var entry in tc)
                        {
                            var w = entry.WorkWeek;
                            sheet = workBook.Worksheets[$"{ entry.Project.Replace("/", "")} Week {entry.WorkWeek + 1}"];
                            sheet.InsertRow(currentRow[w], 1);
                            sheet.Cells[blankRow, 1, blankRow, 20].Copy(sheet.Cells[currentRow[w], 1]);

                            sheet.Cells[currentRow[w], 3].Value = entry.WorkType;
                            sheet.Cells[currentRow[w], 2].Value = entry.Descr;
                            sheet.Cells[currentRow[w], 4].Value = entry.Project;
                            sheet.Cells[currentRow[w], 5 + entry.WorkWeekDay].Value = entry.Hours;
                            sheet.Cells[currentRow[w], 13].Formula = $"= SUM(E{ currentRow[w]}:K{ currentRow[w]})";
                            currentRow[w]++;
                        }
                        foreach (var week in tcWeek)
                        {
                            var w = week.Key.week;
                            sheet = workBook.Worksheets[week.Key.tabName];
                            for (int i = 0; i < 9; i++)
                            {
                                var column = "EFGHIJKLM".Substring(i, 1);
                                sheet.Cells[currentRow[w], i + 5].Formula = $"= SUM({column}{ blankRow}:{column}{ currentRow[w] - 1})";
                            }
                            sheet.Calculate();
                        }
                        if (package.Workbook.Worksheets.Any())
                        {
                            package.Save();
                            fileList.Add(package.File.FullName);
                        }
                    }
                }
            }
        }

        private void GenerateTimeBooks(int contractorId, string name, FileInfo templateFile, int cycle, List<string> fileList)
        {
            var workEntries = _WorkRepo.GetWorkExtended(contractorId, cycle, false).Where(x => "SOW TB".Contains(x.BillType))
                .GroupBy(g => new { g.ClientId, g.ProjectId });

            using (var templatePackage = new ExcelPackage(templateFile))
            {
                var templateSheet = templatePackage.Workbook.Worksheets["TimeBook"];
                var file = new FileInfo($"C:\\TEMP\\{name}_TimeBooks.xlsx");
                System.IO.File.Delete(file.FullName);

                using (var package = new ExcelPackage(file))
                {
                    foreach (var tb in workEntries)
                    {
                        var first = tb.First();
                        var workBook = package.Workbook;
                        int currentRow = 2;
                        ExcelWorksheet sheet = workBook.Worksheets.Add($"{first.Client} {first.Project}", templateSheet);
                        foreach (var entry in tb)
                        {
                            sheet.Cells[currentRow, 1].Value = $"{entry.WorkDate:MM/dd/yyyy}";
                            sheet.Cells[currentRow, 2].Value = entry.Hours;
                            sheet.Cells[currentRow, 3].Value = entry.WorkType;
                            sheet.Cells[currentRow, 4].Value = entry.Descr;
                            currentRow++;
                        }
                    }
                    if (package.Workbook.Worksheets.Any())
                    {
                        package.Save();
                        fileList.Add(package.File.FullName);
                    }
                }
            }
        }

        private void GenerateInvoices(int contractorId, string name, FileInfo templateFile, int cycle, List<string> fileList)
        {
            int blankRow = 14;
            var workEntries = _WorkRepo.GetWorkExtended(contractorId, cycle, true).Where(x => "SOW".Contains(x.BillType))
                .GroupBy(g => new { g.ClientId, g.ProjectId });

            using (var templatePackage = new ExcelPackage(templateFile))
            {
                var templateSheet = templatePackage.Workbook.Worksheets["Invoice"];
                var contractor = _AppUserRepo.GetContractor(contractorId);

                var file = new FileInfo($"C:\\TEMP\\{name}_Invoices.xlsx");
                System.IO.File.Delete(file.FullName);

                using (var package = new ExcelPackage(file))
                {
                    foreach (var inv in workEntries)
                    {
                        var first = inv.First();
                        var workBook = package.Workbook;
                        ExcelWorksheet sheet = workBook.Worksheets.Add($"{first.Client} {first.Project}", templateSheet);
                        sheet.Cells[2, 6].Value = $"{DateTime.Today: M/d/yyyy}";
                        sheet.Cells[9, 3].Value = first.Client;
                        sheet.Cells[10, 3].Value = first.Project;
                        sheet.Cells[2, 2].Value = contractor.InvoiceName;
                        sheet.Cells[3, 2].Value = contractor.InvoiceAddress;
                        sheet.Cells[11, 3].Value = contractor.Rate;

                        int currentRow = blankRow + 1;

                        foreach (var entry in inv)
                        {
                            sheet.InsertRow(currentRow, 1);
                            sheet.Cells[blankRow, 1, blankRow, 10].Copy(sheet.Cells[currentRow, 1]);

                            sheet.Cells[currentRow, 2].Value = $"{entry.WorkDate: M/d}";
                            sheet.Cells[currentRow, 3].Value = $"{entry.WorkType} : {entry.Descr}";
                            sheet.Cells[currentRow, 4].Value = entry.Hours;
                            sheet.Cells[currentRow, 6].Formula = $"=D{currentRow} * C11";
                            currentRow++;
                        }
                        sheet.Cells[currentRow, 4].Formula = $"=SUM(D{blankRow} : D{currentRow - 1})";
                        sheet.Cells[currentRow, 6].Formula = $"=SUM(F{blankRow} : F{currentRow - 1})";
                        sheet.Calculate();
                    }
                    if (package.Workbook.Worksheets.Any())
                    {
                        package.Save();
                        fileList.Add(package.File.FullName);
                    }
                }
            }
        }

        private void GenerateSummary(int contractorId, string name, FileInfo templateFile, int cycle, List<string> fileList)
        {
            var workSummary = _WorkRepo.GetWorkSummary(contractorId).Where(x => x.WorkPeriod < DateRef.CurrentWorkCycle);
            var file = new FileInfo($"C:\\TEMP\\{name}_Summary.xlsx");
            System.IO.File.Delete(file.FullName);
            using (var templatePackage = new ExcelPackage(templateFile))
            {
                var templateSheet = templatePackage.Workbook.Worksheets["Summary"];

                using (var package = new ExcelPackage(file))
                {
                    var workBook = package.Workbook;
                    ExcelWorksheet sheet = workBook.Worksheets.Add("Summary", templateSheet);
                    int currentRow = 2;
                    foreach (var group in workSummary.OrderBy(x => x.Descr).ThenBy(x => x.WorkPeriod).GroupBy(x => x.JobId))
                    {
                        int i = 0;
                        decimal total = 0;
                        foreach (var row in group)
                        {
                            total += row.Hours;
                            sheet.InsertRow(currentRow, 1, currentRow);
                            sheet.Cells[currentRow, 2].Value = row.WorkPeriodDescr;
                            sheet.Cells[currentRow, 3].Value = row.Hours;
                            sheet.Cells[currentRow, 4].Value = total;
                            sheet.Cells[currentRow, 3].Style.Numberformat.Format = "0.00";
                            sheet.Cells[currentRow, 4].Style.Numberformat.Format = "0.00";
                            if (i == group.Count() - 1)
                            {
                                sheet.Cells[currentRow, 4].Style.Font.Bold = true;
                                sheet.Cells[$"A{currentRow - group.Count() + 1}:A{currentRow}"].Merge = true;
                                sheet.Cells[currentRow - group.Count() + 1, 1].Value = row.Descr;
                            }
                            i++;
                            currentRow++;
                        }
                    }
                    currentRow += 5;

                    var paySummary = _PaymentRepo.GetSummary(contractorId, DateRef.CurrentWorkCycle)
                      .OrderBy(x => x.Client).ThenBy(x => x.Project).ThenBy(x => x.BillType);
                    var payments = _PaymentRepo.GetPayments(contractorId);
                    foreach (var summary in paySummary)
                    {
                        sheet.InsertRow(currentRow, 1, currentRow);
                        sheet.Cells[currentRow, 1].Value = summary.Client;
                        sheet.Cells[currentRow, 2].Value = summary.Project;
                        sheet.Cells[currentRow, 3].Value = summary.BillType;
                        sheet.Cells[currentRow, 4].Value = summary.Billed;
                        sheet.Cells[currentRow, 5].Value = summary.Paid;
                        sheet.Cells[currentRow, 6].Value = summary.Balance;
                        sheet.Cells[currentRow, 7].Value = summary.StartDate;
                        sheet.Cells[currentRow, 8].Value = summary.PaidThruDate;
                        var jobPayments = payments.Where(x => x.JobId == summary.JobId)
                            .OrderBy(x => x.PayDate);
                        if (jobPayments.Any())
                        {
                            foreach (var jp in jobPayments)
                            {
                                sheet.Cells[currentRow, 9].Value = jp.Hours;
                                sheet.Cells[currentRow, 10].Value = $"{jp.PayDate:MM/dd/yyyy}";
                                sheet.Cells[currentRow, 11].Value = jp.CheckNo;
                                currentRow++;
                                sheet.InsertRow(currentRow, 1, currentRow);
                            }
                            if (jobPayments.Count() > 1)
                            {
                                for (int i = 0; i <= 7; i++)
                                {
                                    char col = "ABCDEFGH"[i];
                                    sheet.Cells[$"{col}{currentRow - jobPayments.Count()}:{col}{currentRow - 1}"].Merge = true;
                                }
                                sheet.Cells[$"A{currentRow - jobPayments.Count()}:H{currentRow - 1}"].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Top;
                            }
                        }
                        else
                        {
                            currentRow++;
                        }
                    }
                    if (package.Workbook.Worksheets.Any())
                    {
                        package.Save();
                        fileList.Add(package.File.FullName);
                    }
                }
            }
        }

        [Route("Download")]
        [HttpGet]
        public void DownloadTimeDocs(TimeCardCore.Infrastructure.ZipDownload download)
        {
            var response = this.HttpContext.Response;
            response.ContentType = "application/zip";
            // If the browser is receiving a mangled zipfile, IIS Compression may cause
            // this problem. Some members have found that 
            //Response.ContentType = "application/octet-stream" 
            // has solved this. May be specific to Internet Explorer.

            response.Headers.Append("Content-Disposition", $"attachment; filename=\"{Path.GetFileName(download.FileName)}\"");
            response.Headers["Cache-Control"] = "private";
            response.Headers["Expires"] = DateTime.Now.AddMinutes(3).ToString();

            var buffer = new byte[4096];

            using (var zipOutputStream = new ZipOutputStream(response.Body))
            {

                // 0-9, 9 being the highest level of compression
                zipOutputStream.SetLevel(3);

                foreach (string fileName in download.FileList)
                {

                    using (Stream fs = System.IO.File.OpenRead(fileName))
                    {

                        var entry = new ZipEntry(ZipEntry.CleanName(Path.GetFileName(fileName)));
                        entry.Size = fs.Length;
                        // Setting the Size provides WinXP built-in extractor 
                        // compatibility, but if not available, you can instead set 
                        //zipOutputStream.UseZip64 = UseZip64.Off

                        zipOutputStream.PutNextEntry(entry);

                        int count = fs.Read(buffer, 0, buffer.Length);
                        while (count > 0)
                        {
                            zipOutputStream.Write(buffer, 0, count);
                            count = fs.Read(buffer, 0, buffer.Length);
                            response.Body.Flush();
                        }
                    }
                }
            }
            response.Body.Flush();
            response.Body.Close();
        }

        private IEnumerable<SelectListItem> GetPayCycles()
        {
            var thisCycle = decimal.Floor(DateRef.GetWorkDay(DateTime.Today));
            return Enumerable.Range(0, 15).Select(x => new SelectListItem { Text = $"{DateRef.PeriodEndDate(thisCycle - x):MM/dd/yyyy}", Value = (thisCycle - x).ToString() });
        }

        private void prepWork(Models.WorkViewModel vm, bool clearEdit = false)
        {
            var cycles = GetPayCycles();
            int cycle = int.Parse(cycles.First().Value);
            vm.WorkTypes = LookupRepo.GetLookups("WorkType", "- Select -").Select(x => new SelectListItem { Text = x.Descr, Value = x.Id.ToString() });
            vm.PayCycles = cycles;
            vm.IsCycleOpen = false;
            vm.CanCloseCycle = true;
            if (vm.SelectedCycle == 0)
            {
                vm.SelectedCycle = cycle;
            }
            if (vm.SelectedCycle == cycle)
            {
                vm.IsCycleOpen = true;
                vm.CanCloseCycle = false;
            }

            vm.Jobs = _JobRepo.GetJobsForWork(ContractorId, vm.SelectedCycle).Select(x => new SelectListItem { Text = x.Descr, Value = x.Id.ToString() });

            vm.WorkEntries = _WorkRepo.GetWork(ContractorId, vm.SelectedCycle, true);
            if (vm.EditWork == null)
            {
                vm.EditWork = new TimeCard.Domain.Work { ContractorId = ContractorId, WorkDay = DateRef.GetWorkDay(DateTime.Today) };
            }
            if (clearEdit)
            {
                vm.EditWork = new TimeCard.Domain.Work { ContractorId = ContractorId, WorkDay = vm.EditWork.WorkDay, JobId = vm.EditWork.JobId, WorkType = vm.EditWork.WorkType };
            }
            vm.EditDays = GetEditDays(vm.SelectedCycle);
            vm.DailyTotals = new decimal[2][];
            for (int i = 0; i < 2; i++)
            {
                vm.DailyTotals[i] = new decimal[8];
                for (int j = 0; j < 7; j++)
                {
                    vm.DailyTotals[i][j] = vm.WorkEntries.Where(x => x.WeekDay == j + i * 7).Sum(x => x.Hours);
                    vm.DailyTotals[i][7] += vm.DailyTotals[i][j];
                }
            }

            if (!vm.IsCycleOpen)
            {
                vm.IsCycleOpen = _WorkRepo.GetWorkOpen(ContractorId).Any(x => x == vm.SelectedCycle);
            }
        }

        private IEnumerable<SelectListItem> GetEditDays(int thisCycle)
        {
            return Enumerable.Range(0, 14).Select(x => new SelectListItem { Text = $"{DateRef.GetWorkDate(thisCycle + (decimal)x / 100):MM/dd}", Value = (thisCycle + (decimal)x / 100).ToString() });
        }
    }
}
