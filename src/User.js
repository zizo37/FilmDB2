import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Header from "./Header";
import Footer from "./Footer";
import UserRating from "./components/UserRating";
import UserWatchlist from "./components/UserWatchlist";
import UserReview from "./components/UserReviews";
import "./UserStyle.css";
import { supabase } from './supabaseClient';

// const supabase = createClient('https://dzztqaghfzbdepqjpvkn.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6enRxYWdoZnpiZGVwcWpwdmtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNjY1NzMsImV4cCI6MjA1MDc0MjU3M30.4MSnpBef8oe40jbCUzzaP2gtnoI6C42ziWNzos6CFGw');

function User() {
  const [userData, setUserData] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error fetching user data:", error.message);
      } else {
        setSession(data.session);
        setUserData(data.session.user);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <Header />
      <main className="user-profile-section">
        {session && session.user && (
          <div className="user-header">
            <div className="user-info-container">
              <img
                src={session.user.user_metadata.picture}
                alt="profile"
                className="user-avatar"
              />
              <div className="user-details">
                <h1 className="user-name">
                  {session.user.user_metadata.name}
                </h1>
                <p className="user-date">
                  FilmDB member since{" "}
                  {new Date(session.user.created_at).toLocaleDateString()}
                </p>
                <div className="user-actions">
                  <a href="/update-Password" className="user-action-btn">
                    Update Password
                  </a>
                  <a href="/delete-account" className="user-action-btn">
                    Delete Account
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="section-content">
          <UserWatchlist />
          <UserRating />
          <UserReview />
        </div>
      </main>
      <Footer />
    </>
  );
}

export default User;