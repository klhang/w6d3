/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const FollowToggle = __webpack_require__(1);
const UsersSearch = __webpack_require__(3);
const TweetCompose = __webpack_require__(4);

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


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const APIUtil = __webpack_require__(2);

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


/***/ }),
/* 2 */
/***/ (function(module, exports) {

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


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const APIUtil = __webpack_require__(2);
const FollowToggle = __webpack_require__(1);

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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const APIUtil = __webpack_require__(2);

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


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map