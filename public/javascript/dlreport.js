
document.getElementById('dlreport').addEventListener('click', function () {
    const element = document.getElementById('dlreport_table');
    const filename =
      document.getElementById("test_title").innerText + ' - ' +
      document.getElementById("add_info").innerText;
    const opt = {
        margin: 0,
        filename,
        image: { type: 'jpeg', quality: 1 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf(element, opt);
});

