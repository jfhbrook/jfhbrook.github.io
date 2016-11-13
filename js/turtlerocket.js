function turtlerocket(user, readSelect, writeSelect) {
  var text = '';

  var fullText = readSelect.text().split('\n');

  var i = 0;
  while (!text && i < fullText.length) {
    text = fullText[i];
    i++;
  }


  var uri = 'https://turtlerocket-2016.nodeknockout.com/api/v1/search?user='+encodeURIComponent(user)+'&q='+encodeURIComponent(text);

  var get = $.get(uri, function(data) {
    console.log(data);
    if (data.hits) {
      writeSelect.append('<ul>' + data.hits.reduce(function(txt, result) {
        txt += '<li><a href="' + result.link + '">'+result.title+'</a></li>';
      }, '') + '</ul>')
    }
    else {
      writeSelect.append('<ul><li>hi</li></ul>')
    }
  }).fail(function(data) {
    console.log('failed!');
    console.log(data);
    console.log(get);
  });
}
