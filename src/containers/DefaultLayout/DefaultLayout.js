import React, { Suspense } from 'react';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';
import _, { trim } from 'lodash';
import {
  AppBreadcrumb2 as AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
import fantasynav from '../../nav/fantasynav';
import fantasyRoutes from '../../routes/fantasyroutes';
import Swal from 'sweetalert2';
import useSession from 'react-session-hook';
import { useAlert } from 'react-alert';

const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

const DefaultLayout = (props) => {
  const { Redirect, Route, Switch } = router;
  const session = useSession();
  const alert = useAlert();
  const loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>;
  let n;
  let r;

  if (session.profile) {
    n = fantasynav;
    r = fantasyRoutes;

    if (session.profile.user_type === "editor") {
      const modules = session.profile.permissions.map((e) => trim(e.manager));
      r = r.filter((e) => modules.includes(e.module) && e);
      n.items = n.items.filter((e) => modules.includes(e.name) && e);
    }
  }

  const signOut = (e) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Logout",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        session.removeSession();
        localStorage.clear();
        alert.success("Successfully Logout");
        document.cookie = "token" + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      }
    });
  };

  if (!session.isAuthenticated) {
    let user_type = localStorage.getItem("user_type") || null;
    if (user_type) {
      localStorage.removeItem('user_type');
      document.cookie = "token" + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      return <Redirect to={_.includes(['admin', 'editor'], user_type) && "/login"} />;
    } else if(window.location.pathname.includes("forgot-password")) {
      localStorage.removeItem('user_type');
      return <Redirect to={window.location.pathname} />;
    }    else if(window.location.pathname.includes("reset-password")) {
      localStorage.removeItem('user_type');
      return <Redirect to={window.location.pathname} />;
    }    else {
      localStorage.removeItem('user_type');
      document.cookie = "token" + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      return <Redirect to="/login" />;
    }
  }

  if (session.isAuthenticated) {
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={loading()}>
            <DefaultHeader onLogout={signOut} />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav navConfig={n} {...props} router={router} />
            </Suspense>
            <AppSidebarFooter />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={r} router={router} />
            <Container fluid>
              <Suspense fallback={loading()}>
                <Switch>
                  {r && r?.map((route, idx) => (
                    route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact || true}
                        name={route.name}
                        render={prop => <route.component {...prop} />}
                      />
                    ) : null
                  ))}
                  {(localStorage.getItem('switchItem') === 'quiz' || localStorage.getItem('switchItem') === null) && <Redirect from="/" to="/fantasy-dashboard" />}
                </Switch>
              </Suspense>
            </Container>
          </main>
        </div>
        <AppFooter>
          <Suspense fallback={loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
};

export default DefaultLayout;
