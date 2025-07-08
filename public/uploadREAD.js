<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>SmartInventory</title>
  <style>
    body {
      font-family: sans-serif;
      padding: 2rem;
      background: #f4f4f4;
    }
    button {
      padding: 1rem 1.5rem;
      font-size: 1rem;
      background: #007bff;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 4px;
      margin-right: 1rem;
    }
    button:hover {
      background: #0056b3;
    }
    #result {
      margin-top: 2rem;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      background: white;
    }
    th, td {
      padding: 0.75rem;
      text-align: left;
      border: 1px solid #ccc;
    }
    th {
      background: #eee;
    }
    tr.updated {
      background-color: #e1fbe1;
    }
    tr.skipped {
      background-color: #fff7d6;
    }
    .section-title {
      margin-top: 2rem;
      font-weight: bold;
      font-size: 1.1rem;
    }
    .message {
      margin-top: 1rem;
      padding: 1rem;
      background: #fff;
      border: 1px solid #ccc;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>

  <h1>SmartInventory</h1>

  <input type="file" id="fileInput" accept=".csv" style="display: none;" />
  <button id="uploadBtn">Upload CSV</button>
  <button onclick="window.location='/api/inventory/export-csv'">Download Inventory CSV</button>

  <div id="result"></div>

  <script>
    const fileInput = document.getElementById('fileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const resultDiv = document.getElementById('result');

    uploadBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', async () => {
      const file = fileInput.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);
      resultDiv.innerHTML = '<div class="message">Uploading...</div>';

      try {
        const uploadRes = await fetch('/api/receipts/upload', {
          method: 'POST',
          body: formData
        });

        const data = await uploadRes.json();
        resultDiv.innerHTML = '';

        const summary = document.createElement('div');
        summary.className = 'message';
        summary.textContent = `✅ ${data.message}`;
        resultDiv.appendChild(summary);

        if (data.updatedItems?.length) {
          const updatedTitle = document.createElement('div');
          updatedTitle.className = 'section-title';
          updatedTitle.textContent = '🟢 Updated Items';
          resultDiv.appendChild(updatedTitle);

          const updatedTable = document.createElement('table');
          updatedTable.innerHTML = `
            <tr>
              <th>#</th><th>SKU</th><th>Logo</th><th>New Qty</th>
            </tr>
          `;
          data.updatedItems.forEach((item, i) => {
            const row = document.createElement('tr');
            row.className = 'updated';
            row.innerHTML = `
              <td>${i + 1}</td>
              <td>${item.sku}</td>
              <td>${item.logo}</td>
              <td>${item.newQty}</td>
            `;
            updatedTable.appendChild(row);
          });
          resultDiv.appendChild(updatedTable);
        }

        if (data.skippedRows?.length) {
          const skippedTitle = document.createElement('div');
          skippedTitle.className = 'section-title';
          skippedTitle.textContent = '⚠️ Skipped Rows';
          resultDiv.appendChild(skippedTitle);

          const skippedTable = document.createElement('table');
          skippedTable.innerHTML = `
            <tr>
              <th>#</th><th>Line</th><th>Reason</th>
            </tr>
          `;
          data.skippedRows.forEach((row, i) => {
            const tr = document.createElement('tr');
            tr.className = 'skipped';
            tr.innerHTML = `
              <td>${i + 1}</td>
              <td>${row.line}</td>
              <td>${row.reason}</td>
            `;
            skippedTable.appendChild(tr);
          });
          resultDiv.appendChild(skippedTable);
        }

        // Trigger inventory download automatically
        const csvRes = await fetch('/api/inventory/export-csv');
        const blob = await csvRes.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'SmartInventory.csv';
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

      } catch (err) {
        resultDiv.innerHTML = '<div class="message">❌ Upload failed.</div>';
        console.error(err);
      }
    });
  </script>

</body>
</html>

