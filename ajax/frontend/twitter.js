const FollowToggle = require("./follow_toggle");
const UsersSearch = require("./users_search");
const TweetCompose = require("./tweet_compose");

$( () => {
  $(".follow-toggle").each((idx, el) => {
    const toggle = new FollowToggle(el);
  });

  $(".users-search").each((idx, el) => {
    const search = new UsersSearch(el);
  });

  $(".tweet-compose").each((idx, el) => {
    const compose = new TweetCompose(el);
  });
});
