import $ from 'jquery'
import Vue from 'vue/dist/vue.esm'

const API_URL_KOUME = 'http://localhost:3000/v1/koume'

const app = new Vue({
  el: '#kie-chat',
  data: {
    userMessage: '',
    messages: [{
      message: 'こんにちは、キーちゃんだッピ',
      url: null,
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
      categoryCode: 0,
      areaName: '',
      categoryName: ''
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
      const message = app.userMessage
      app.userMessage = ''
      callKoume(message).then((messages) => {
        if (messages == null) {
          escapeSilence()
          scrollToBottom()
          return
        }
        app.messages = app.messages.concat(messages)
        scrollToBottom()
      }).catch(err => {
        escapeError()
        scrollToBottom()
      })
    }
  }
})

const escapeSilence = () => {
  app.messages.push({
    message: 'データが見つからなかったッピ！',
    url: null,
    isUserMessage: false
  }),
  app.messages.push({
    message: '他に知りたい何が知りたいッピ？',
    url: null,
    isUserMessage: false
  })
}

const escapeError = () => {
  app.messages.push({
    message: '今は頭が働かないッピ',
    url: null,
    isUserMessage: false
  })
  app.messages.push({
    message: '少し待ってからもう一回話しかけてくれッピ',
    url: null,
    isUserMessage: false
  })
}

const scrollToBottom = () => {
  $('#kie-chat').delay(100).animate({
    scrollTop: $('#scroll-area').height()
  }, 300)
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
      if (!data.talkResponse) {
        resolve()
        return
      }
      const contents = data.talkResponse.messages
      const messages = contents.map(c => {
        return {
          message: c.words,
          url: c.url,
          isUserMessage: false
        }
      })
      resolve(messages)
    }).fail(err => {
      reject(err)
    })
  })
}

$(window).on('load', () => {
  $('#textinput').focus()
})