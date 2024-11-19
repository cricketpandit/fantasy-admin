import React from 'react';

const Dashboard = React.lazy(() => import('../views/Dashboard/Dashboard'));
const GSTReport = React.lazy(() => import('../views/GstReport/GSTReport'));

const UserProfile = React.lazy(() => import('../views/CommanPage/UserProfile'));
const ChangePass = React.lazy(() => import('../views/CommanPage/ChangePass'));

const SubAdmins = React.lazy(() => import('../views/SubAdmin/SubAdmins'));
const AddSubAdmin = React.lazy(() => import('../views/SubAdmin/AddSubAdmin'));
const EditSubAdmin = React.lazy(() => import('../views/SubAdmin/EditSubAdmin'));

const Users = React.lazy(() => import('../views/Users/Users'));
const AddUser = React.lazy(() => import('../views/Users/AddUser'));
const EditUser = React.lazy(() => import('../views/Users/EditUser'));
const UserQuizMatches = React.lazy(() => import('../views/Users/Action/UserQuizMatches'));
const ImportUsers = React.lazy(() => import('../views/Users/ImportUsers'));

const Banners = React.lazy(() => import('../views/Banners/Banners'));
const AddBanner = React.lazy(() => import('../views/Banners/AddBanner'));
const EditBanner = React.lazy(() => import('../views/Banners/EditBanner'));

const Questions = React.lazy(() => import('../views/Questions/Questions'));
const AddQuestion = React.lazy(() => import('../views/Questions/AddQuestion'));
const EditQuestion = React.lazy(() => import('../views/Questions/EditQuestion'));
const ImportQuestion = React.lazy(() => import('../views/Questions/ImportQuestion'));

const AddQuizCategory = React.lazy(() => import('../views/QuizCategory/AddQuizCategory.js'));
const EditQuizCategory = React.lazy(() => import('../views/QuizCategory/EditQuizCategory.js'));
const QuizCategoryList = React.lazy(() => import('../views/QuizCategory/QuizCategoryList.js'));

const Coupons = React.lazy(() => import('../views/Coupons/Coupons'));
const AddCoupon = React.lazy(() => import('../views/Coupons/AddCoupon'));
const EditCoupon = React.lazy(() => import('../views/Coupons/EditCoupon'));

const QuizEarningManager = React.lazy(() => import('../views/EarningManager/QuizEarningManager'));
const ContestEarningManager = React.lazy(() => import('../views/EarningManager/ContestEarningManager'));

const StaticPages = React.lazy(() => import('../views/StaticPages/StaticPages'));
const EditStaticPage = React.lazy(() => import('../views/StaticPages/EditStaticPage'));

const EmailTemplates = React.lazy(() => import('../views/EmailTemplates/EmailTemplates'));
const EditEmailTemplate = React.lazy(() => import('../views/EmailTemplates/EditEmailTemplate'));

const WalletManager = React.lazy(() => import('../views/WalletManager/WalletManager'));

const Settings = React.lazy(() => import('../views/Settings/Settings'));
const Notifications = React.lazy(() => import('../views/Notifications/Notifications'));
const Transactions = React.lazy(() => import('../views/Transactions/Transactions'));
const AccountStatement = React.lazy(() => import('../views/AccountStatement/AccountStatement'));
const ReferralHistory = React.lazy(() => import('../views/Referral/ReferralHistory.js'));

const WithdrawRequests = React.lazy(() => import('../views/Withdrawals/WithdrawRequests'));
const QuizMatches = React.lazy(() => import('../views/quizMatches/quizMatches'));
const TdsDetails = React.lazy(() => import('../views/TdsDetails/TdsDetails'));


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const adminroutes = [
  { path: '/', exact: true, name: 'Home', Module: 'Dashboard' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, Module: 'Dashboard' },
 
  { path: '/userprofile', name: 'User Profile', component: UserProfile },
  { path: '/change-password', name: 'Change Password', component: ChangePass },

  { path: '/sub-admins', name: 'Sub Admins', component: SubAdmins, Module: 'Dashboard' },
  { path: '/add-sub-admin', name: 'Add Sub Admin', component: AddSubAdmin, Module: 'Dashboard' },
  { path: '/edit-sub-admin/:id', name: 'Edit Sub Admin', component: EditSubAdmin, Module: 'Dashboard' },

  { path: '/users', name: 'Users', component: Users, Module: 'Users' },
  { path: '/add-user', name: 'Add User', component: AddUser, Module: 'Users' },
  { path: '/edit-user/:id', name: 'Edit User', component: EditUser, Module: 'Users' },
  { path: '/user-quiz-matches/:id', name: 'User Matches', component: UserQuizMatches, Module: 'Users' },
  { path: '/import-users', name: 'Import Users', component: ImportUsers, Module: 'Users' },

  { path: '/banners', name: 'Banners', component: Banners, Module: 'Banners' },
  { path: '/add-banner', name: 'Add Banner', component: AddBanner, Module: 'Banners' },
  { path: '/edit-banner/:id', name: 'Edit Banner', component: EditBanner, Module: 'Banners' },

  { path: '/questions', name: 'Questions', component: Questions, Module: 'Questions' },
  { path: '/add-question', name: 'Add Question', component: AddQuestion, Module: 'Questions' },
  { path: '/edit-question/:id', name: 'Edit Question', component: EditQuestion, Module: 'Questions' },
  { path: '/import-questions', name: 'Import Question', component: ImportQuestion, Module: 'Questions' },

  { path: '/questions/category', name: 'Category', component: QuizCategoryList, Module: 'Category' },
  { path: '/questions/category/add', name: 'Add Question Category', component: AddQuizCategory, Module: 'Category Add' },
  { path: '/questions/category/edit/:id', name: 'Edit Question Category', component: EditQuizCategory, Module: 'Category Edit' },

  { path: '/earning/quiz', name: 'Quiz Earning', component: QuizEarningManager, Module: 'Quiz Earning' },
  { path: '/earning/contests', name: 'Contest Earning', component: ContestEarningManager, Module: 'Quiz Earning' },
  { path: '/tds-details/', name: 'TDS Details', component: TdsDetails, Module: 'TDS Details' },

  { path: '/coupons', name: 'Coupons', component: Coupons, Module: 'Coupons' },
  { path: '/add-coupon', name: 'Add Coupon', component: AddCoupon, Module: 'Coupons' },
  { path: '/edit-coupon/:id', name: 'Edit Coupon', component: EditCoupon, Module: 'Coupons' },

  { path: '/static-pages', name: 'Static Pages', component: StaticPages, Module: 'Static Pages' },
  { path: '/edit-static-pages', name: 'Edit Static Page', component: EditStaticPage, Module: 'Static Pages' },

  { path: '/email-templates', name: 'Email Templates', component: EmailTemplates, Module: 'Email Templates' },
  { path: '/edit-email-template', name: 'Edit Email Template', component: EditEmailTemplate, Module: 'Email Templates' },

  { path: '/notifications', name: 'Notifications', component: Notifications, Module: 'Notifications' },
  { path: '/transactions', name: 'Transactions', component: Transactions, Module: 'Transactions' },
  { path: '/quiz-matches', name: 'Quiz Matches', component: QuizMatches, Module: 'Quiz Matches' },

  { path: '/wallets', name: 'Wallet Manager', component: WalletManager },
  { path: '/statements/:userId?', name: 'Account Statement', component: AccountStatement, Module: 'Dashboard' },
  { path: '/referral-details/:userId?', name: 'Referral Statement', component: ReferralHistory, Module: 'Dashboard' },
  { path: '/withdarwals', name: 'Withdraw Requests', component: WithdrawRequests, Module: 'Dashboard' },
  { path: '/settings', name: 'Settings', component: Settings },
  { path: '/gst-report', name: 'GST Report', component: GSTReport, Module: "GST Report" },
];

export default adminroutes;
