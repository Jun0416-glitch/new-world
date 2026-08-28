const express = require('express');
const axios = require('axios');
const app = express();

app.get('/example-page', async (req, res) => {
  try {
    const response = await axios.get('https://adbpage.com/adblock?v=3');

    const htmlResponse = `
      <html>
        <head>
          <title>Example Page</title>
          ${response.data}
        </head>
        <body>
          <script type="text/javascript">
            aclib.runAutoTag({
              zoneId: 'ncmnzd4cor',
            });
          </script>
        </body>
      </html>
    `;

    res.send(htmlResponse);
  } catch (error) {
    res.status(500).send();
  }
});

app.listen(9000, () => {
  console.log('Server is running on port 9000');
});
