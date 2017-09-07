const APIUtil = require('./api_util');
const FollowToggle = require('./follow_toggle');

class UsersSearch {
  constructor(el) {
    this.$el = $(el);
    this.$input = this.$el.find("input");
    this.$ul = $(".users");
    this.handleInput();
  }

  handleInput() {
    let that = this;
    this.$input.on('input', (e) => {
      const search = $(e.currentTarget).val();
      APIUtil.searchUsers(search, this.renderResults.bind(this));
    });
  }

  renderResults (matchingUsers) {
    this.$ul.empty();
    $(matchingUsers).each((idx, el) => {
      const $li = $(`<li>`);
      const $a = $('<a>');
      $a.attr("href", `/users/${el.id}`).append(el.username);
      $li.append($a);
      const $button = $("<input>").attr("type", "submit").attr("class", "follow-toggle");
      const followState = el.followed ? "followed" : "unfollowed";
      const $toggle = new FollowToggle($button, { userId: el.id, followState: followState });
      $li.append($button);
      this.$ul.append($li);
    });
  }
}

module.exports = UsersSearch;
