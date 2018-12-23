// キーちゃん独自処理スクリプト
var ques = 0; // 質問の段階判断用変数(0:開始,1:地域質問受付フェイズ,2:分類質問受付フェイズ,3:感謝フェイズ)
var inputVal = ""; // 入力文言格納変数

var koume = 'http://localhost:3000/koume';

$(function() {
  $('#trans').on('click',function() {
    question();
  });
});

/**
 * 入力した文言を出力し応答する関数
 * @param quesNUm 現愛の質問フェイズ変数
 */
function question() {
  switch(ques) {
    case 0:
      inputVal = $('#input').val();
      $('#chatbody').append(
        '<div class="bodydiv">' +
          '<div class="balloon1-right col-sm-10">' +
            '<p>' + inputVal + '</p>' +
          '</div>' +
        '</div>'
      );
      callKoume();
      ques++;
      break;
/* 分類質問応答処理
    case 1:
      $('#chatbody').append(
        '<div class="bodydiv">' +
          '<div class="balloon1-right">' +
            '<p>' + $('#input').val() + '</p>' +
          '</div>' +
        '</div>' +

        '<div class="bodydiv">' +
          '<div class="balloon1-left">' +
            '<p>' + area + 'の' + $('#input').val() + 'は53万でゴワす！</p>' +
          '</div>' +
        '</div>'
      );
      ques++;
      break;
/* 感謝応答処理
    case 2:
      $('#chatbody').append(
        '<div class="bodydiv">' +
          '<div class="balloon1-right">' +
            '<p>' + $('#input').val() + '</p>' +
          '</div>' +
        '</div>' +

        '<div class="bodydiv">' +
          '<div class="balloon1-left">' +
            '<p>どういたしましてでゴザル！</p>' +
          '</div>' +
        '</div>' +

        '<div class="bodydiv">' +
          '<div class="balloon1-left">' +
            '<p>どの町の情報が知りたいキー？</p>' +
          '</div>' +
        '</div>'
      );
      ques = 0;
      break;
*/
    default:
      break;
  }
  function callKoume() {
    $.ajax({
      type: 'POST',
      url: koume,
      data: inputVal
    })
    //↓フォームの送信に成功した場合の処理
    .done(function(data) {
      var response = data.talkResponse; // 返信結果
      var content = response[0].content; // 返信内容(配列の一個目だけ取る)
      var url = ""; // 返信URL
      // URLを変数に詰めるループ
      response.forEach(function(val) {
          url += '<br><a href="' + val.url + '">' + val.url + '</a>'; // 改行してリンク文字列にして出力
      });
      $('#chatbody').append(
        '<div class="bodydiv">' +
          '<div class="balloon1-left col-sm-10">' +
            '<p>' +
              content +
              url +
            '</p>' +
          '</div>' +
        '</div>'
      );
    })
    //↓フォームの送信に失敗した場合の処理
    .fail(function() {
      alert('error');
    });
  }
}
