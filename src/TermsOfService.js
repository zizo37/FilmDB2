import React from 'react';
import './PolicyStyles.css';
import Footer from './Footer';
import Header from './Header';

const TermsOfService = () => {
  return (
    <div className="policy-page">
        <Header />
      <div className="policy-container">
        <div className="policy-header">
          <h1 className="policy-title">Terms of Service</h1>
          <p className="policy-subtitle">
            Please read these terms carefully before using our services. By accessing or using
            our platform, you agree to be bound by these terms and conditions.
          </p>
        </div>

        <div className="policy-section">
          <h2 className="section-title">User Accounts</h2>
          <div className="section-content">
            <p>
              To access certain features of our website, you may be required to create an
              account. You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your account.
            </p>
          </div>
        </div>

        <div className="policy-section">
          <h2 className="section-title">Content and Intellectual Property</h2>
          <div className="section-content">
            <p>
              Our website and its contents, including but not limited to text, graphics,
              logos, and images, are protected by intellectual property laws. You may not
              reproduce, distribute, or modify any part of our website without our prior
              written consent.
            </p>
          </div>
        </div>

        <div className="policy-section">
          <h2 className="section-title">User-Generated Content</h2>
          <div className="section-content">
            <p>
              You are solely responsible for any content you submit or post on our website.
              By submitting content, you grant us a non-exclusive, royalty-free license to
              use, reproduce, modify, and distribute the content.
            </p>
          </div>
        </div>

        <div className="policy-section">
          <h2 className="section-title">Third-Party Links</h2>
          <div className="section-content">
            <p>
              Our website may contain links to third-party websites or services. We are not
              responsible for the content or practices of those third-party websites or
              services.
            </p>
          </div>
        </div>

        <div className="policy-section">
          <h2 className="section-title">Limitation of Liability</h2>
          <div className="section-content">
            <p>
              Our website is provided on an "as is" and "as available" basis. We make no
              warranties or representations of any kind, express or implied, regarding the
              use of our website or the information, services, or products provided through
              our website.
            </p>
          </div>
        </div>

        <div className="policy-section">
          <h2 className="section-title">Termination</h2>
          <div className="section-content">
            <p>
              We reserve the right to terminate or suspend your access to our website at any
              time, without notice, for any reason.
            </p>
          </div>
        </div>

        <div className="policy-section">
          <h2 className="section-title">Governing Law</h2>
          <div className="section-content">
            <p>
              These Terms of Service shall be governed by and construed in accordance with
              the laws of the jurisdiction in which we operate.
            </p>
          </div>
        </div>

        <div className="contact-info">
          <p>Have questions about our Terms of Service?</p>
          <p>Contact us at <a href="mailto:support@filmdb.com">support@filmdb.com</a></p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;