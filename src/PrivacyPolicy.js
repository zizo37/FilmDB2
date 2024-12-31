import React from 'react';
import './PolicyStyles.css';
import Header from './Header';
import Footer from './Footer';

const PrivacyPolicy = () => {
  return (
    <div className="policy-page">
        <Header />
      <div className="policy-container">
        <div className="policy-header">
          <h1 className="policy-title">Privacy Policy</h1>
          <p className="policy-subtitle">
            We value your privacy and are committed to protecting your personal information.
            Learn how we collect, use, and safeguard your data.
          </p>
        </div>

        <div className="policy-section">
          <h2 className="section-title">Information We Collect</h2>
          <div className="section-content">
            <p>
              We may collect personal information such as your name, email address, and other
              contact details when you create an account or sign up for our services. We may
              also collect non-personal information, such as your device information, browsing
              activity, and usage data, to improve our services.
            </p>
          </div>
        </div>

        <div className="policy-section">
          <h2 className="section-title">How We Use Your Information</h2>
          <div className="section-content">
            <p>
              We use the information we collect to provide and improve our services,
              communicate with you about our products and promotions, and personalize your
              experience on our website.
            </p>
          </div>
        </div>

        <div className="policy-section">
          <h2 className="section-title">Data Security</h2>
          <div className="section-content">
            <p>
              We take reasonable measures to protect your personal information from
              unauthorized access, disclosure, or misuse. However, no method of transmitting
              or storing data is completely secure, and we cannot guarantee the absolute
              security of your information.
            </p>
          </div>
        </div>

        <div className="policy-section">
          <h2 className="section-title">Third-Party Disclosure</h2>
          <div className="section-content">
            <p>
              We may share your information with trusted third parties who assist us in
              operating our website, conducting our business, or servicing you. We will not
              sell or rent your personal information to third parties for their marketing
              purposes without your consent.
            </p>
          </div>
        </div>

        <div className="policy-section">
          <h2 className="section-title">Your Rights</h2>
          <div className="section-content">
            <p>
              You have the right to access, update, or delete your personal information at
              any time. You can also opt-out of receiving marketing communications from us.
            </p>
          </div>
        </div>

        <div className="policy-section">
          <h2 className="section-title">Changes to This Policy</h2>
          <div className="section-content">
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our
              practices or legal requirements. We encourage you to review this page
              periodically for the latest information.
            </p>
          </div>
        </div>

        <div className="contact-info">
          <p>Have questions about our Privacy Policy?</p>
          <p>Contact us at <a href="mailto:support@filmdb.com">support@filmdb.com</a></p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;