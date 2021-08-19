import React from "react";
import Navbar from "./../components/Navbar";
import IndexPage from "./index";
import AboutPage from "./about";
import FaqPage from "./faq";
import PricingPage from "./pricing";
import ContactPage from "./contact";
import DashboardPage from "./dashboard";
import SettingsPage from "./settings";
import PurchasePage from "./purchase";
import AuthPage from "./AuthPage";
import { Switch, Route, Router } from "./../util/router.js";
import Auth0Callback from "./auth0-callback.js";
import NotFoundPage from "./not-found.js";
import Footer from "./../components/Footer";
import { AuthProvider } from "./../util/auth.js";
import { ThemeProvider } from "./../util/theme.js";
import { QueryClientProvider } from "./../util/db.js";
import Gymx from "./gymx";
import FeedPage from "./FeedPage";


function App(props) {
  return (
    <QueryClientProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <>
              <Navbar
                color="default"
                logo="https://uploads.divjoy.com/logo.svg"
                logoInverted="https://uploads.divjoy.com/logo-white.svg"
              />

              <Switch>
                <Route exact path="/" component={IndexPage} />

                <Route exact path="/gymx" component={Gymx} />

                <Route exact path="/about" component={AboutPage} />

                <Route exact path="/faq" component={FaqPage} />

                <Route exact path="/pricing" component={PricingPage} />

                <Route exact path="/contact" component={ContactPage} />

                <Route exact path="/dashboard" component={DashboardPage} />

                <Route exact path="/feed" component={FeedPage} />

                <Route
                  exact
                  path="/settings/:section"
                  component={SettingsPage}
                />

                <Route exact path="/purchase/:plan" component={PurchasePage} />

                <Route exact path="/auth/:type" component={AuthPage} />

                <Route exact path="/auth0-callback" component={Auth0Callback} />

                <Route component={NotFoundPage} />
              </Switch>

              <Footer
                bgColor="light"
                size="normal"
                bgImage=""
                bgImageOpacity={1}
                description="A short description of what you do here"
                copyright={`© ${new Date().getFullYear()} Company`}
                logo="https://uploads.divjoy.com/logo.svg"
                logoInverted="https://uploads.divjoy.com/logo-white.svg"
                sticky={true}
              />
            </>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
