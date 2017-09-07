const APIUtil = require('./api_util');

class TweetCompose {
  constructor(el) {
    this.$el = $(el);
    this.submit();
    this.charLimit();
    this.addMentionUser();
  }

  submit() {
    this.$el.on("submit", e => {
      e.preventDefault();
      const data = this.$el.serializeJSON();
      $(":input").prop("disabled");
      APIUtil.createTweet(data, this.handleSuccess.bind(this));
    });
  }

  clearInput() {
    $(":input").val("");
  }

  handleSuccess(res) {
    this.clearInput();
    $(":input").removeProp();
    const tweet = JSON.stringify(res);
    const feedId = this.$el.data('tweets-ul');
    const $ul = $(feedId);
    const $li = $('<li>').append(tweet);
    $ul.append($li);
  }

  charLimit() {
    const $textarea = this.$el.find("textarea");
    let total = 0;
    $textarea.on("input",  (e) => {
      total += 1;
      const $charsLeft = $('.chars-left');
      $charsLeft.text(`${140 - total} characters left`);
    });
  }

  addMentionUser() {
    $('.add-mentioned-user').click((e) => {
      e.preventDefault();
      const $scriptTag = this.$el.find("script");
      const $html = $scriptTag.html();
      $(".mentioned-users").append($html);
      return false;
    });
  }
}

module.exports = TweetCompose;
