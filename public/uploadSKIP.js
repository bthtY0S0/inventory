<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>SmartInventoryXX</title>
  <style>
    body {
      font-family: sans-serif;
      padding: 2rem;
      background: #f4f4f4;
    }
    #uploadBtn, #downloadBtn {
      padding: 1rem 1.5rem;
      font-size: 1rem;
      margin-right: 1rem;
      background: #007bff;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 4px;
    }
    #uploadBtn:hover, #downloadBtn:hover {
      background: #0056b3;
    }
    #result {
      margin-top: 2rem;
      white-space: pre-wrap;
      background: #fff;
      padding: 1rem;
      border: 1px solid #ccc;
    }
  </style>
</head>
<body>

  <h1>SmartInventoryXX</h1>

  <!-- Hidden file input -->
  <input type="file" id="fileInput" accept=".csv" style="display: none;" />

  <!-- Visible buttons -->
  <button id="uploadBtn">Upload CSV</button>
  <button id="downloadBtn" onclick="window.location='/api/inventory/export-csv'">
    Download Inventory CSV
  </button>

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
      resultDiv.textContent = 'Uploading...';

      try {
        const uploadRes = await fetch('/api/receipts/upload', {
          method: 'POST',
          body: formData
        });

        const uploadData = await uploadRes.json();
        resultDiv.textContent = JSON.stringify(uploadData, null, 2);

        console.log('Upload complete. Trying inventory export...');

        const exportRes = await fetch('/api/inventory/export-csv');
        const blob = await exportRes.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'SmartInventory.csv';
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        console.log('Download triggered.');

      } catch (err) {
        resultDiv.textContent = 'Upload failed.';
        console.error(err);
      }
    });
  </script>

</body>
</html>

