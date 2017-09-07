const APIUtil = require('./api_util');

class FollowToggle {
  constructor(el, options) {
    this.$el = $(el);
    this.userId = this.$el.data('user-id') || options.userId;
    this.followState = (this.$el.data('initial-follow-state') ||
                        options.followState);
    this.render();
    this.handleClick();
  }

  render() {
    if (this.followState === "unfollowed") {
      this.$el.val("Follow!");
    } else if (this.followState === "followed") {
      this.$el.val("Unfollow!");
    } else {
      this.$el.prop("disabled");
    }
  }

  followSuccess() {
    this.followState = "followed";
    this.render();
  }

  unfollowSuccess() {
    this.followState = "unfollowed";
    this.render();
  }

  handleClick() {
    this.$el.on("click", e => {
      e.preventDefault();
      if (this.followState === "unfollowed") {
        this.followState = "following";
        this.render();
        APIUtil.followUser(this.userId).then(this.followSuccess.bind(this));
      } else if (this.followState === "followed") {
        this.followState = "unfollowing";
        this.render();
        APIUtil.unfollowUser(this.userId).then(this.unfollowSuccess.bind(this));
      }
    });
  }
}

module.exports = FollowToggle;
