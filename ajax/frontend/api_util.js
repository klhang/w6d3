const APIUtil = {
  followUser: id => {
    return $.ajax({
      type: 'POST',
      dataType: 'JSON',
      url: `/users/${id}/follow`
    });
  },

  unfollowUser: id => {
    return $.ajax({
      type: 'DELETE',
      dataType: 'JSON',
      url: `/users/${id}/follow`
    });
  },

  searchUsers: (queryVal, success) => {
    return $.ajax({
      type: 'GET',
      dataType: 'JSON',
      url: `/users/search?query=${queryVal}`,
      success(data) {
        success(data);
      }
    });
  },

  createTweet: (tweetData, success) => {
    return $.ajax({
      type: 'POST',
      dataType: 'JSON',
      url: `/tweets`,
      data: tweetData,
      success(data) {
        success(data);
      }
    });
  }
};

module.exports = APIUtil;
