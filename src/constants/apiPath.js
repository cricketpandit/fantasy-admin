let apiUrl = {

  /* Admin Dashboard APIs */

  adminLogin: '/admin/login',
  adminForgotPassword:"/admin/forgot-password",
  adminResetPassword:"/admin/reset-password",
  get_dashBoard_data: '/admin/dashboard',
  get_admin_earning_graph: '/admin/get-admin-earning-graph',
  change_Password_by_admin: '/admin/change-password-by-admin',
  get_admin_profile: '/admin/get-admin-profile',
  update_admin_profile: '/admin/admin-profile',
  change_admin_password: '/admin/change-password',

  get_sub_admins: '/admin/sub-admins',
  add_sub_admin: '/admin/add-sub-admin',
  get_sub_admin: '/admin/get-sub-admin',
  update_sub_admin: '/admin/update-sub-admin',
  delete_sub_admin: '/admin/delete-subadmin',

  get_users: '/admin/users',
  get_match_pool_stats: '/fantasy/get-match-pool-stats',
  getReportList: '/v1.1/fantasy/reportList',
  getReportinguserList: '/v1.1/fantasy/reportingList',
  updateChatStatus: '/v1.1/fantasy/update-chatStatus',

  addInfluencerCode: '/admin/add-influencer-code',
  deleteInfluencerCode: '/admin/delete-influencer-code',
  InfluencerCodeList: '/admin/influencer-code-list',





  get_users_list: '/admin/users-list',

  add_user: '/admin/add-user',
  get_user: '/admin/get-user',
  update_user: '/admin/update-user',
  delete_user: '/admin/delete-user',
  search_user: '/admin/users',
  change_Status: '/admin/change-status',
  update_bank_status: '/admin/update-bank-status',
  update_pan_status: '/admin/update-pan-status',
  update_identity_status: '/admin/update-identity-status',
  import_users: '/admin/import-users',
  toggle_ban_status: '/admin/toggle-ban-status',


  create_crypto_wallet: '/crypto/create-crypto-wallet',
  get_tokens: '/admin/tokens',
  add_token: '/admin/add-token',
  get_token: '/admin/get-token',
  update_token: '/admin/update-token',
  delete_token: '/admin/delete-token',
  search_token: '/admin/tokens',
  change_token_Status: '/admin/change-token-status',
  import_tokens: '/admin/import-tokens',


  get_coupons_for_banners: '/fantasy/get-coupons-for-banners',
  get_series: '/fantasy/get-series',
  get_all_series: '/fantasy/get-all-series',
  get_upcoming_series: '/fantasy/get-upconing-series',
  getCricketSeries: '/fantasy/get-cricket-series',
  

  series_old_matches: '/fantasy/series-old-matches',
  get_all_teams: '/fantasy/get-all-teams',
  get_series_contest: '/fantasy/series-contest',
  get_series_all_matches: '/fantasy/series-all-matches',
  series_new_matches: '/fantasy/series-new-matches',

  get_single_series_data: '/fantasy/get-single-series-data',
  get_single_team_data: '/fantasy/get-single-team-data',
  update_short_name: '/fantasy/update-short-name',
  series_change_status: '/fantasy/series-change-status',
  change_match_status: '/fantasy/change-match-status',
  edit_flag: '/fantasy/edit-flag',
  update_flag: '/fantasy/update-flag',
  update_jersey: '/fantasy/update-jersey',
  update_player_info: '/fantasy/update-player-info',
  get_series_teams: '/fantasy/get-series-teams',
  get_series_players: '/fantasy/get-series-players',
  get_players_list: '/fantasy/get-players-list',
  tds_details: '/fantasy/tds-details',
  create_guru_team: '/fantasy/create-guru-team',

  //booster shop
  getBoosterCategoryList: '/booster/getCategoryList',
  // getBoosterKeyValueList: '/booster/getCategoryKeyValueList',
  // getBoosterKeyValueList: '/booster/getBoosterKeyValueList',
  getSubCategoryList: '/booster/getSubCategoryList',
  getBoosterList: '/booster/getBoosterList',
  getBoosterListBySubCategory: '/booster/getBoosterListBySubCategory',
  getSubscriptionsListForAdmin: '/booster/getSubscriptionsListForAdmin',

  addBoosterCategory: '/booster/addBoosterCategory',
  updateBoosterCategory: '/booster/updateBoosterCategory',
  updateBooster: '/booster/updateBooster',
  addBooster: '/booster/addBooster',
  giftBoosterFromAdmin: '/v1.1/fantasy/giftBoosterFromAdmin',
  addSubscription: '/booster/addSubscription',
  updateSubscription: '/booster/updateSubscription',
  getSubscription: '/booster/getSubscription',





  get_t10_batting: '/fantasy/get-t10-batting',
  update_t10_batting: '/fantasy/update-t10-batting',
  get_t10_bowling: '/fantasy/get-t10-bowling',
  update_t10_bowling: '/fantasy/update-t10-bowling',
  get_t10_feilding: '/fantasy/get-t10-feilding',
  update_t10_feilding: '/fantasy/update-t10-feilding',
  get_t10_other: '/fantasy/get-t10-other',
  update_t10_other: '/fantasy/update-t10-other',
  get_t10_economy: '/fantasy/get-t10-economy',
  update_t10_economy: '/fantasy/update-t10-economy',
  get_t10_strike: '/fantasy/get-t10-strike',
  update_t10_strike: '/fantasy/update-t10-strike',

  get_t20_batting: '/fantasy/get-t20-batting',
  update_t20_batting: '/fantasy/update-t20-batting',
  get_t20_bowling: '/fantasy/get-t20-bowling',
  update_t20_bowling: '/fantasy/update-t20-bowling',
  get_t20_feilding: '/fantasy/get-t20-feilding',
  update_t20_feilding: '/fantasy/update-t20-feilding',
  get_t20_other: '/fantasy/get-t20-other',
  update_t20_other: '/fantasy/update-t20-other',
  get_t20_economy: '/fantasy/get-t20-economy',
  update_t20_economy: '/fantasy/update-t20-economy',
  get_t20_strike: '/fantasy/get-t20-strike',
  update_t20_strike: '/fantasy/update-t20-strike',

  get_odi_batting: '/fantasy/get-odi-batting',
  update_odi_batting: '/fantasy/update-odi-batting',
  get_odi_bowling: '/fantasy/get-odi-bowling',
  update_odi_bowling: '/fantasy/update-odi-bowling',
  get_odi_feilding: '/fantasy/get-odi-feilding',
  update_odi_feilding: '/fantasy/update-odi-feilding',
  get_odi_other: '/fantasy/get-odi-other',
  update_odi_other: '/fantasy/update-odi-other',
  get_odi_economy: '/fantasy/get-odi-economy',
  update_odi_economy: '/fantasy/update-odi-economy',
  get_odi_strike: '/fantasy/get-odi-strike',
  update_odi_strike: '/fantasy/update-odi-strike',


  add_cricket_category: '/admin/add-cricket-category',
  get_cricket_categories: '/admin/cricket-categories',

  getQuizCategory: '/admin/questions/category',


  get_active_cricket_categories: '/admin/get-active-cricket-categories',
  get_cricket_category: '/admin/cricket-category',
  update_cricket_category: '/admin/update-cricket-category',
  delete_cricket_category: '/admin/delete-cricket-category',
  search_cricket_category: '/admin/cricket-categories',
  cricket_category_change_Status: '/admin/cricket-category-change-status',


  changeQuizCategoryStatus: '/admin/questions/category/change-status',
  updateQuizCategory: '/admin/questions/category/update',
  deleteQuizCategory: '/admin/questions/category/delete',
  getQuizCategoryById: '/admin/questions/category/',
  getQuizCategoryByType: '/admin/questions/category/keyValue',


  get_cricket_constest: '/admin/cricket-contests',
  view_cricket_contest: '/admin/view-cricket-contest',
  get_cricket_user_constest: '/admin/cricket-user-contests',
  add_cricket_contest: '/admin/add-cricket-contest',
  add_price_breakup_cricket: '/admin/add-price-breakup-cricket',
  get_cricket_contest: '/admin/get-cricket-contest',

  get_cricket_season_earning: '/admin/get-cricket-league-earning',




  update_cricket_contest: '/admin/update-cricket-contest',
  cricket_contest_change_status: '/admin/cricket-contest-change-status',
  delete_cricket_contest: '/admin/delete-cricket-contest',
  

  //cricket season contest
  get_cricket_season_constest: '/admin/cricket-season-contests',
  add_cricket_season_contest: '/admin/add-cricket-season-contest',
  add_price_breakup_cricket_season: '/admin/add-price-breakup-cricket-season',
  get_cricket_season_contest: '/admin/get-season-cricket-contest',
  update_cricket_season_contest: '/admin/update-cricket-season-contest',
  cricket_season_contest_change_status: '/admin/cricket-season-contest-change-status',
  delete_cricket_season_contest: '/admin/delete-cricket-season-contest',

  get_test_batting: '/fantasy/get-test-batting',
  update_test_batting: '/fantasy/update-test-batting',
  get_test_bowling: '/fantasy/get-test-bowling',
  update_test_bowling: '/fantasy/update-test-bowling',
  get_test_feilding: '/fantasy/get-test-feilding',
  update_test_feilding: '/fantasy/update-test-feilding',
  get_test_other: '/fantasy/get-test-other',
  update_test_other: '/fantasy/update-test-other',
  get_test_economy: '/fantasy/get-test-economy',
  update_test_economy: '/fantasy/update-test-economy',
  get_test_strike: '/fantasy/get-test-strike',
  update_test_strike: '/fantasy/update-test-strike',


  add_promotional_banner: '/admin/add-promotional-banner',
  get_promotional_banners: '/admin/promotional-banners',
  get_promotional_banner: '/admin/promotional-banner',
  update_promotional_banner: '/admin/update-promotional-banner',
  delete_promotional_banner: '/admin/delete-promotional-banner',
  search_promotional_banner: '/admin/promotional-banners',
  promotional_banner_change_status: '/admin/promotional-banner-change-status',
  
  add_banner: '/admin/add-banner',
  get_banners: '/admin/banners',
  get_admin_banners: '/admin/get-admin-banners',
  get_banner: '/admin/banner',
  update_banner: '/admin/update-banner',
  delete_banner: '/admin/delete-banner',
  search_banner: '/admin/banners',
  banner_change_Status: '/admin/banner-change-status',

  add_home_banner: '/admin/add-home-banner',
  get_home_banners: '/admin/home-banners',
  get_home_banner: '/admin/home-banner',
  update_home_banner: '/admin/update-home-banner',
  delete_home_banner: '/admin/delete-home-banner',
  search_home_banner: '/admin/home-banners',
  home_banner_change_Status: '/admin/home-banner-change-status',

  add_bottom_banner: '/admin/add-bottom-banner',
  get_bottom_banners: '/admin/bottom-banners',
  get_bottom_banner: '/admin/bottom-banner',
  get_bottom_banner_by_type: '/admin/bottom-banner-by-type',
  update_bottom_banner: '/admin/update-bottom-banner',
  delete_bottom_banner: '/admin/delete-bottom-banner',
  search_bottom_banner: '/admin/bottom-banners',
  bottom_banner_change_Status: '/admin/bottom-banner-change-status',

  add_faq: '/admin/add-faq',
  get_faqs: '/admin/faqs',
  get_faq: '/admin/faq',
  update_faq: '/admin/update-faq',
  delete_faq: '/admin/delete-faq',
  search_faq: '/admin/faqs',
  faq_change_Status: '/admin/faq-change-status',


  get_web_banners: '/admin/web-banners',
  get_banner_by_id: '/admin/web-banner',
  update_web_banner: '/admin/update-web-banner',
  change_web_banner_Status: '/admin/change-web-banner-Status',


  add_quiz_category: '/admin/add-quiz-category',
  get_quiz_categories: '/admin/quiz-categories',
  get_active_categories: '/admin/get-active-categories',
  get_quiz_category: '/admin/quiz-category',
  update_quiz_category: '/admin/update-quiz-category',
  delete_quiz_category: '/admin/delete-quiz-category',
  search_quiz_category: '/admin/quiz-categories',
  quiz_category_change_Status: '/admin/quiz-category-change-status',
  quiz_change_Status: '/admin/quiz-change-status',

  get_quizzes: '/admin/quizzes',
  add_quiz: '/admin/add-quiz',
  get_quiz: '/admin/get-quiz',
  update_quiz: '/admin/update-quiz',
  delete_quiz: '/admin/delete-quiz',

  get_constest: '/admin/contests',
  get_all_constest: '/admin/get-all-contests',
  get_all_cricket_season_constest: '/admin/get-all-season-contests',


  // get_cricket_contest: '/admin/get-cricket-contest',
  add_contest: '/admin/add-contest',
  add_price_breakup: '/admin/add-price-breakup',
  get_contest: '/admin/get-contest',
  update_contest: '/admin/update-contest',
  contest_change_status: '/admin/contest-change-status',
  delete_contest: '/admin/delete-contest',

  get_questions: '/admin/questions',
  add_question: '/admin/add-question',
   get_question: '/admin/question',
  update_question: '/admin/update-question',
  getMachTeams:"/fantasy/get-match-teams",
  question_change_Status: '/admin/question-change-status',
  get_quiz_by_category: '/admin/get-quiz-by-category',
  get_contest_by_category: '/admin/get-contest-by-category',
  import_questions: '/admin/import-questions',
  delete_question: '/admin/delete-question',


  get_coupons: '/admin/coupons',
  add_coupon: '/admin/add-coupon',
  get_coupon: '/admin/get-coupon',
  get_coupons_users: '/admin/get-coupon-users',
  update_coupon: '/admin/update-coupon',
  coupon_change_status: '/admin/coupon-change-status',
  delete_coupon: '/admin/delete-coupon',
  
  get_influencers: '/admin/influencers',
  add_influencer: '/admin/add-influencer',
  get_influencer: '/admin/get-influencer',
  get_influence_users: '/admin/get-influence-users',
  update_influencer: '/admin/update-influencer',
  influencer_change_status: '/admin/influencer-change-status',
  delete_influencer: '/admin/delete-influencer',


  get_withdrawals: '/admin/get-withdrawals',
  update_withdrawal_request: '/admin/update-withdrawals',

  getEmailTemplates: '/admin/get-email-templates',
  updateEmailTemplate: '/admin/update-email-template',
  emailtemplate_change_Status: '/admin/emailtemplate-change-status',

  add_news: '/admin/add-news',
  get_news: '/admin/news',
  get_news_info: '/admin/news-info',
  update_news: '/admin/update-news',
  delete_news: '/admin/delete-news',
  search_news: '/admin/news',
  news_change_Status: '/admin/news-change-status',

  add_video: '/admin/add-video',
  get_video: '/admin/videos',
  get_video_info: '/admin/video-info',
  update_video: '/admin/update-video',
  delete_video: '/admin/delete-video',
  search_video: '/admin/videos',
  video_change_Status: '/admin/video-change-status',

  add_ads: '/admin/add-ads',
  get_ads: '/admin/ads',
  get_ads_info: '/admin/ads-info',
  update_ads: '/admin/update-ads',
  delete_ads: '/admin/delete-ads',
  search_ads: '/admin/ads',
  ads_change_Status: '/admin/ads-change-status',


  getStaticPages: '/admin/get-static-pages',
  updateStaticPages: '/admin/update-static-pages',
  StaticPages_change_Status: '/admin/static-pages-change-status',


  getNotifications: '/admin/get-notifications',
  send_notification: '/admin/send-notification',


  get_setting: '/admin/get-settings',
  get_sidebar_moudles: '/admin/get-sidebar-moudles',
  update_setting: '/admin/update-settings',
  update_merchindise: '/admin/update-merchindise',

  get_transactions: '/admin/get-transactions',
  get_statements: '/admin/account-statement',
  referralDetails: '/admin/referral-history',
  getUserReferralAmountDetails: '/admin/getUserReferralAmountDetails',
  distributeReferralAmount: '/admin/distributeReferralAmount',




  get_wallets: '/admin/user-wallets',
  update_wallet: '/admin/update-wallets',

  get_contest_match: '/admin/contest_matches',
  get_quiz_match: '/admin/quiz-matches',

  update_rank: '/admin/contest-rank-calculation',
  update_prize_distribution: '/admin/contest-prize-distribution',
  contest_winners: '/admin/contest-matche-winners',


  get_series_matches: '/fantasy/get-series-matches',
  get_series_live_matches: '/fantasy/get-series-live-matches',
  get_series_completed_matches: '/fantasy/get-series-completed-matches',
  series_completed_matches_distribution: '/fantasy/series-completed-matches-distribution',
  refresh_series_completed_matches_rank: '/fantasy/refresh-series-completed-matches-rank',
  series_match_extend_time: '/fantasy/extend-series-matche-time',
  update_match_lineup: '/fantasy/update-match-lineup',
  toggle_favourite: '/fantasy/toggle-favourite',
  get_contest_Bycategory: '/fantasy/get-contest-by-category',
  update_match_schedule_contest: '/fantasy/update-match-schedule-contest',
  get_match_byId: '/fantasy/get-match-byId',
  get_match_detail_by_match_id: '/fantasy/get-match-detail-by-match-id',
  get_reward_users_list: '/fantasy/get-reward-users-list',
  get_contest_details_for_admin: '/fantasy/get-contest-details-for-admin',
  
  /* User APIs */
  userLogin: '/user/login',
  gst_report: '/fantasy/gst-report',
  generate_pre_signed_url: '/fantasy/generate-pre-signed-url',
  generate_team_pre_signed_url: '/fantasy/generate-team-pre-signed-url',
  pre_signed_url_generate: '/fantasy/pre-signed-url-generate',

}
export default apiUrl;
