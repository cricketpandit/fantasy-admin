import React from 'react';

const FantasyDashboard = React.lazy(() => import('../views/Dashboard/FantasyDashboard'));
const GSTReport = React.lazy(() => import('../views/GstReport/GSTReport'));

const UserProfile = React.lazy(() => import('../views/CommanPage/UserProfile'));
const ChangePass = React.lazy(() => import('../views/CommanPage/ChangePass'));

const Users = React.lazy(() => import('../views/Users/Users'));
const AddUser = React.lazy(() => import('../views/Users/AddUser'));
const EditUser = React.lazy(() => import('../views/Users/EditUser'));

const SubAdmins = React.lazy(() => import('../views/SubAdmin/SubAdmins'));
const AddSubAdmin = React.lazy(() => import('../views/SubAdmin/AddSubAdmin'));
const EditSubAdmin = React.lazy(() => import('../views/SubAdmin/EditSubAdmin'));

const Banners = React.lazy(() => import('../views/Banners/Banners'));
const AddBanner = React.lazy(() => import('../views/Banners/AddBanner'));
const EditBanner = React.lazy(() => import('../views/Banners/EditBanner'));

const PromotionalBanners = React.lazy(() => import('../views/PromotionalBanners/PromotionalBanner.js'));
const AddPromotionalBanner = React.lazy(() => import('../views/PromotionalBanners/AddPromotionalBanner.js'));
const EditPromotionalBanner = React.lazy(() => import('../views/PromotionalBanners/EditPromotionalBanner.js'));

const HomeBanners = React.lazy(() => import('../views/HomeBanners/HomeBanners'));
const AddHomeBanner = React.lazy(() => import('../views/HomeBanners/AddHomeBanner'));
const EditHomeBanner = React.lazy(() => import('../views/HomeBanners/EditHomeBanner'));

const Faq = React.lazy(() => import('../views/Faqs/Faq'));
const AddFaq = React.lazy(() => import('../views/Faqs/AddFaq'));
const EditFaq = React.lazy(() => import('../views/Faqs/EditFaq'));

const Coupons = React.lazy(() => import('../views/Coupons/Coupons'));
const AddCoupon = React.lazy(() => import('../views/Coupons/AddCoupon'));
const EditCoupon = React.lazy(() => import('../views/Coupons/EditCoupon'));
const ListCouponUsers = React.lazy(() => import('../views/Coupons/ListCouponUsers'));

const Influencers = React.lazy(() => import('../views/Influencer/Influencers'));
const AddInfluencer = React.lazy(() => import('../views/Influencer/AddInfluencer'));
const EditInfluencer = React.lazy(() => import('../views/Influencer/EditInfluencer'));
const ListInfluencerUsers = React.lazy(() => import('../views/Influencer/ListInfluenceUsers'));

const StaticPages = React.lazy(() => import('../views/StaticPages/StaticPages'));
const EditStaticPage = React.lazy(() => import('../views/StaticPages/EditStaticPage'));

const EmailTemplates = React.lazy(() => import('../views/EmailTemplates/EmailTemplates'));
const EditEmailTemplate = React.lazy(() => import('../views/EmailTemplates/EditEmailTemplate'));

const Settings = React.lazy(() => import('../views/Settings/Settings'));
const Merchandise = React.lazy(() => import('../views/Settings/Merchandise'));
const Notifications = React.lazy(() => import('../views/Notifications/Notifications'));
const Transactions = React.lazy(() => import('../views/Transactions/Transactions'));
const AccountStatement = React.lazy(() => import('../views/AccountStatement/AccountStatement'));
const WithdrawRequests = React.lazy(() => import('../views/Withdrawals/WithdrawRequests'));

const WalletManager = React.lazy(() => import('../views/WalletManager/WalletManager'));

const CricketEarningManager = React.lazy(() => import('../views/EarningManager/Earning/CricketEarningManager'));
const CricketSeasonEarningManager = React.lazy(() => import('../views/EarningManager/Earning/CricketSeasonEarningManager'));


const Series = React.lazy(() => import('../views/Series/Series'));
const UpdateShortName = React.lazy(() => import('../views/Series/UpdateShortName'));
const PointSystem = React.lazy(() => import('../views/PointSystem/PointSystem'));
const Team = React.lazy(() => import('../views/TeamsManager/Teams'));
const UpdateFlag = React.lazy(() => import('../views/TeamsManager/UpdateFlag'));
const SeriesPlayers = React.lazy(() => import('../views/PlayersManager/SeriesPlayers'));

const CricketCategory = React.lazy(() => import('../views/CricketCategory/CricketCategory'));
const AddCricketCategory = React.lazy(() => import('../views/CricketCategory/AddCricketCategory'));
const EditCricketCategory = React.lazy(() => import('../views/CricketCategory/EditCricketCategory'));

const CricketContest = React.lazy(() => import('../views/CricketContest/Contests'));
const UserContests = React.lazy(() => import('../views/CricketContest/UserContests'));
const AddCricketContest = React.lazy(() => import('../views/CricketContest/AddContest'));
const EditCricketContest = React.lazy(() => import('../views/CricketContest/EditContest'));
const ViewCricketContest = React.lazy(() => import('../views/CricketContest/ViewCricketContest'));

const TdsDetails = React.lazy(() => import('../views/TdsDetails/TdsDetails'));
const BoosterShop = React.lazy(() => import('../views/BoosterManager/BoosterShop.js'));

const ScheduleContest = React.lazy(() => import('../views/ScheduleContest/ScheduleContest'));
const ScheduleAddContest = React.lazy(() => import('../views/ScheduleContest/ScheduleAddContest'));
const WinningUsersList = React.lazy(() => import('../views/ScheduleContest/WinningUsersList'));

const Questions = React.lazy(() => import('../views/Questions/Questions'));
const AddQuestion = React.lazy(() => import('../views/Questions/AddQuestion'));
const EditQuestion = React.lazy(() => import('../views/Questions/EditQuestion'));
const ImportQuestion = React.lazy(() => import('../views/Questions/ImportQuestion'));

const AddQuizCategory = React.lazy(() => import('../views/QuizCategory/AddQuizCategory.js'));
const EditQuizCategory = React.lazy(() => import('../views/QuizCategory/EditQuizCategory.js'));
const QuizCategoryList = React.lazy(() => import('../views/QuizCategory/QuizCategoryList.js'));

//cricket season contest
const CricketSeasonContest = React.lazy(() => import('../views/CricketSeasonContest/CricketSeasonContest'));
const AddCricketSeasonContest = React.lazy(() => import('../views/CricketSeasonContest/AddCricketSeasonContest'));
const EditCricketSeasonContest = React.lazy(() => import('../views/CricketSeasonContest/EditCricketSeasonContest'));

const InfluencerManagement = React.lazy(() => import('../views/Influencer/InfluencerManagement.js'));

const fantasyRoutes = [
  { path: '/', exact: true, name: 'Home', module: "Home" },

  { path: '/fantasy-dashboard', name: 'Fantasy Dashboard', component: FantasyDashboard, module: "Dashboard" },

  { path: '/questions', name: 'Questions', component: Questions, module: 'Quiz' },

  { path: '/questions/category', name: 'Category', component: QuizCategoryList, module: 'Quiz' },
  { path: '/questions/category/add', name: 'Add Question Category', component: AddQuizCategory, module: 'Quiz' },
  { path: '/questions/category/edit/:id', name: 'Edit Question Category', component: EditQuizCategory, module: 'Quiz' },
  
  { path: '/add-question', name: 'Add Question', component: AddQuestion, module: 'Quiz' },
  { path: '/edit-question/:id', name: 'Edit Question', component: EditQuestion, module: 'Quiz' },
  { path: '/import-questions', name: 'Import Question', component: ImportQuestion, module: 'Quiz' },
  
  { path: '/userprofile', name: 'My Profile', component: UserProfile, module: "Dashboard" },
  { path: '/change-password', name: 'Change Password', component: ChangePass, module: 'Dashboard' },

  { path: '/users', name: 'Users', component: Users, module: 'User Management', },
  { path: '/add-user', name: 'Add User', component: AddUser, module: 'User Management', },
  { path: '/edit-user/:id', name: 'Edit User', component: EditUser, module: 'User Management', },

  // { path: '/influencers', name: 'influencers', component: InfluencerManagement, module: 'Influencers', },

  { path: '/sub-admins', name: 'Sub Admins', component: SubAdmins, module: 'Sub Admins', },
  { path: '/add-sub-admin', name: 'Add Sub Admin', component: AddSubAdmin, module: 'Sub Admins', },
  { path: '/edit-sub-admin/:id', name: 'Edit Sub Admin', component: EditSubAdmin, module: 'Sub Admins', },

  { path: '/update-short-name/:id', name: 'Update Short name', component: UpdateShortName, module: "Cricket" },
  { path: '/edit-flag/:id', name: 'Update Flag', component: UpdateFlag, module: 'Cricket' },
  { path: '/tds-details/', name: 'TDS Details', component: TdsDetails, module: 'TDS Details' },

  { path: '/cricket/category', name: 'Cricket Category', component: CricketCategory, module: 'Cricket' },
  { path: '/cricket/add-category', name: 'Add Cricket Category', component: AddCricketCategory, module: 'Cricket' },
  { path: '/cricket/edit-category/:id', name: 'Edit Cricket Category', component: EditCricketCategory, module: 'Cricket' },

  { path: '/cricket/contests', name: 'Cricket contests', component: CricketContest, module: 'Cricket' },
  { path: '/cricket/user-contests', name: 'Cricket / User Contests', component: UserContests, module: 'Cricket' },
  { path: '/cricket/add-contest', name: 'Add Cricket Contest', component: AddCricketContest, module: 'Cricket' },
  { path: '/cricket/edit-contest/:id', name: 'Edit Cricket Contest', component: EditCricketContest, module: 'Cricket' },
  { path: '/cricket/view-contest/:id', name: 'View User Contest', component: ViewCricketContest, module: 'Cricket' },

  { path: '/cricket/series', name: 'Series', component: Series, module: 'Cricket' },
  { path: '/cricket/mst-teams/', name: 'Teams', component: Team, module: 'Cricket' },
  { path: '/cricket/point-system/', name: 'Point System', component: PointSystem, module: 'Cricket' },
  { path: '/cricket/series-players/', name: 'Series Players', component: SeriesPlayers, module: 'Cricket' },
  { path: '/cricket/schedule-contest', name: 'Schedule Contests', component: ScheduleContest, module: 'Cricket' },
  { path: '/cricket/schedule-update-contests/:id', name: 'Schedule Add Contests', component: ScheduleAddContest, module: 'Cricket' },
  { path: '/cricket/winning-users-list/:id', name: 'Winning Users List', component: WinningUsersList, module: 'Cricket' },
  { path: '/booster-shop', name: 'Booster List', component: BoosterShop, module: 'Booster Shop' },
  
  //season contest for cricket
  { path: '/cricket/season-contests/', name: 'Cricket Season Contest', component: CricketSeasonContest, module: 'Cricket' },
  { path: '/cricket/add-season-contest/', name: 'Add Cricket Season Contest', component: AddCricketSeasonContest, module: 'Cricket' },
  { path: '/cricket/edit-season-contests/:id', name: 'Edit Cricket Season Contest', component: EditCricketSeasonContest, module: 'Cricket' },

  { path: '/earning/daily-cricket', name: 'Earning', component: CricketEarningManager, module: 'Earning Manager' },
  { path: '/earning/season-cricket', name: 'Earning', component: CricketSeasonEarningManager, module: 'Earning Manager' },
  
  { path: '/banners', name: 'Banners', component: Banners, module: 'Banners' },
  { path: '/add-banner', name: 'Add Banner', component: AddBanner, module: 'Banners' },
  { path: '/edit-banner/:id', name: 'Edit Banner', component: EditBanner, module: 'Banners' },

  { path: '/promotional-banners', name: 'Promotional Banners', component: PromotionalBanners, module: 'Banners' },
  { path: '/add-promotional-banner', name: 'Add Promotional Banner', component: AddPromotionalBanner, module: 'Banners' },
  { path: '/edit-promotional-banner/:id', name: 'Edit Promotional Banner', component: EditPromotionalBanner, module: 'Banners' },

  { path: '/home-banners', name: 'Home Banners', component: HomeBanners, module: 'Banners' },
  { path: '/add-home-banner', name: 'Add Home Banner', component: AddHomeBanner, module: 'Banners' },
  { path: '/edit-home-banner/:id', name: 'Edit Home Banner', component: EditHomeBanner, module: 'Banners' },

  { path: '/faqs', name: 'Faq', component: Faq, module: 'Faqs' },
  { path: '/add-faq', name: 'Add Faq', component: AddFaq, module: 'Faqs' },
  { path: '/edit-faq/:id', name: 'Edit Faq', component: EditFaq, module: 'Faqs' },

  { path: '/coupons', name: 'Coupons', component: Coupons, module: 'Coupons' },
  { path: '/add-coupon', name: 'Add Coupon', component: AddCoupon, module: 'Coupons' },
  { path: '/edit-coupon/:id', name: 'Edit Coupon', component: EditCoupon, module: 'Coupons' },
  { path: '/list-coupon-users/:coupon_code', name: 'Coupon / Users', component: ListCouponUsers, module: 'Coupons' },

  { path: '/influencers', name: 'Influencers', component: Influencers, module: 'Influencers' },
  { path: '/add-influencer-code', name: 'Add Influencer', component: AddInfluencer, module: 'Influencers' },
  { path: '/edit-influencer-code/:id', name: 'Edit Influencer', component: EditInfluencer, module: 'Influencers' },
  { path: '/list-influencer-code-users/:id', name: 'Influencers / Users', component: ListInfluencerUsers, module: 'Influencers' },

  { path: '/static-pages', name: 'Static Pages', component: StaticPages, module: 'Static Pages' },
  { path: '/edit-static-pages', name: 'Edit Static Page', component: EditStaticPage, module: 'Static Pages' },

  { path: '/email-templates', name: 'Email Templates', component: EmailTemplates, module: 'Email Templates' },
  { path: '/edit-email-template', name: 'Edit Email Template', component: EditEmailTemplate, module: 'Email Templates' },

  { path: '/notifications', name: 'Notifications', component: Notifications, module: 'Notifications' },
  { path: '/transactions', name: 'Transactions', component: Transactions, module: 'Transactions' },

  { path: '/wallets', name: 'Wallet Manager', component: WalletManager, module: 'Wallet Manager' },
  { path: '/statements/:userId?', name: 'Account Statement', component: AccountStatement, module: 'Account Statement' },
  
  { path: '/withdarwals', name: 'Withdraw Requests', component: WithdrawRequests, module: 'Withdraw Request' },
  { path: '/gst-report', name: 'GST Report', component: GSTReport, module: 'Gst Report' },
  { path: '/settings', name: 'Settings', component: Settings, module: 'Settings' },
  { path: '/merchandise', name: 'Settings', component: Merchandise, module: 'Settings' },
];

export default fantasyRoutes;
