const fs = require('fs');
const path = require('path');

function serveStatic(req, res) {
  // Serve static
  const filePath = path.join(__dirname, 'public', req.url);

  fs.lstat(filePath, function (err, stat) {
    if (stat && stat.isDirectory()) {
      // проблема на занятии была в том, что я отдавал страницу по запросу на
      // адрес например /farm и относительные пути с этого файла считались от
      // / - корневого каталога.
      // запросы на /farm/ работали нормально
      // live-server переадресует браузер, что сделаем и мы!
      // Просто отправим ответ со статусов 302 и новым адресом в заголовке.
      // Получив такой ответ, браузер пойдет перейдет туда и все будет ок.
      let redirectUrl = req.url;
      // еще немного работы со строками - и "/farm" и "/farm/" должны преобразоваться
      // в "/farm/index.html" (если farm - папка)
      if (!redirectUrl.endsWith('/')) {
        redirectUrl = `${redirectUrl}/`;
      }
      redirectUrl = `${redirectUrl}index.html`;
      // отправляем редирект и закрываем все. Браузер придет еще раз, но уже
      // по новому адресу. Конкретно этот запрос мы обработали.
      res.writeHead(302, {
        Location: redirectUrl,
      });
      res.end();
      return;
    }

    fs.readFile(filePath, function (err, data) {
      if (err) {
        res.statusCode = 404;
        res.end();
        return;
      }

      const headers = {};
      if (req.url.endsWith('.js')) {
        // Если для .js файла указан тип module, то требуется указать MIME type
        headers['Content-Type'] = 'text/javascript';
      }

      res.writeHead(200, headers);

      res.write(data);
      res.end();
    });
  });
}

module.exports = {
  serveStatic,
};
