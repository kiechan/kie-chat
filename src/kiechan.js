import $ from 'jquery'
import Vue from 'vue/dist/vue.esm'

const API_URL_KOUME = 'http://localhost:3000/v1/koume'

const app = new Vue({
  el: '#kie-chat',
  data: {
    userMessage: '',
    messages: [{
      message: 'こんにちは、キーちゃんだッピ',
      url: 'https://google.com/',
      isUserMessage: false
    },
    {
      message: '知りたいことを教えてくれッピ！',
      url: null,
      isUserMessage: false
    }],
    talkId: 0,
    sessionInfo: {
      areaCode: 0,
      categoryCode: 0
    }
  },
  methods: {
    sendMessage: () => {
      if (app.userMessage === '') {
        return
      }
      app.messages.push({
        message: app.userMessage,
        url: null,
        isUserMessage: true
      })
      callKoume(app.userMessage).then((messages) => {
        app.messages.push(messages)
        app.userMessage = ''
        scrollToBottom()
      }).catch(err => {
        app.messages.push({
          message: '今は頭が働かないッピ',
          url: null,
          isUserMessage: false
        })
        scrollToBottom()
      })
    }
  }
})

const scrollToBottom = () => {
  $('#kie-chat').delay(100).animate({
    scrollTop: $('#scroll-area').height()
  },300)
}

const callKoume = (userMessage) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'POST',
      url: API_URL_KOUME,
      data: {
        talkContent: userMessage
      }
    }).done(data => {
      const contents = data.talkResponse
      const messages = contents.map(c => {
        return {
          message: 'aaaa',
          url: '',
          isUserMessage: false
        }
      })
      resolve(messages)
    }).fail(err => {
      reject(err)
    })
  })
}
