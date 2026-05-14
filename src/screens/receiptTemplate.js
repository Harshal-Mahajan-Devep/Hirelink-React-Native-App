export const getReceiptHTML = payment => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial; padding: 20px; }
          h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          td, th { border: 1px solid #333; padding: 8px; }
        </style>
      </head>
      <body>
        <h2>Hirelink Receipt</h2>

        <p><b>Name:</b> ${payment?.name || '-'}</p>
        <p><b>Email:</b> ${payment?.email || '-'}</p>
        <p><b>Amount:</b> ${payment?.amount || '-'}</p>
        <p><b>Date:</b> ${payment?.date || '-'}</p>

        <table>
          <tr>
            <th>Description</th>
            <th>Amount</th>
          </tr>
          <tr>
            <td>Candidate Signup Fee</td>
            <td>${payment?.amount || '-'}</td>
          </tr>
        </table>
      </body>
    </html>
  `;
};
