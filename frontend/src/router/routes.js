import SessionFormPage from 'pages/SessionFormPage.vue';
import SummaryPage from 'pages/SummaryPage.vue';

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: SessionFormPage },
      { path: 'summary', component: SummaryPage },
    ],
  },
];

export default routes;
