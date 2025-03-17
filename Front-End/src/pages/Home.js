import React, { useState, useEffect } from "react";
import { Bell, Calendar, ChevronRight, PawPrint, Settings, LineChart, Heart, User, Plus } from "lucide-react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "../css/Homepage.css";

function Home() {
  const [petData, setPetData] = useState({
    name: "Buddy",
    species: "Dog",
    breed: "Golden Retriever",
    age: 3,
    weight: 65,
    lastFeeding: "Today, 8:30 AM",
    lastWalk: "Today, 7:15 AM",
    upcomingVet: "March 15, 2:00 PM",
    healthScore: 92
  });

  const [notifications, setNotifications] = useState([
    { id: 1, message: "Time for Buddy's evening meal", time: "5:00 PM" },
    { id: 2, message: "Medication reminder: Heart worm pill", time: "Tomorrow" },
    { id: 3, message: "Low on dog food - 2 days remaining", time: "March 12" }
  ]);

  // Simulate fetch data
  useEffect(() => {
    // This would be an API call in a real app
    console.log("Fetching pet data...");
  }, []);

  return (
    <>
    <NavBar/>
    <div className="homepage-container">
      
      
      <div className="homepage-hero">
        <div className="homepage-hero-content">
          <h1>Welcome Back to PetPal</h1>
          <p>Your smart companion for better pet care</p>
        </div>
      </div>

      <div className="homepage-dashboard">
        <div className="homepage-main-content">
          <section className="homepage-pet-profile">
            <div className="homepage-profile-header">
              <div className="homepage-profile-image">
                {/* This would be an actual image in production */}
                <div className="homepage-profile-placeholder">
                  <PawPrint size={40} />
                </div>
              </div>
              <div className="homepage-profile-info">
                <h2>{petData.name}</h2>
                <p>{petData.breed} • {petData.age} years old</p>
              </div>
              <div className="homepage-health-score">
                <div className="homepage-score-circle">
                  <span>{petData.healthScore}</span>
                </div>
                <p>Health Score</p>
              </div>
            </div>
            
            <div className="homepage-quick-stats">
              <div className="homepage-stat">
                <Calendar size={20} />
                <div>
                  <h4>Last Feeding</h4>
                  <p>{petData.lastFeeding}</p>
                </div>
              </div>
              <div className="homepage-stat">
                <PawPrint size={20} />
                <div>
                  <h4>Last Walk</h4>
                  <p>{petData.lastWalk}</p>
                </div>
              </div>
              <div className="homepage-stat">
                <Heart size={20} />
                <div>
                  <h4>Upcoming Vet</h4>
                  <p>{petData.upcomingVet}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="homepage-activity-feed">
            <div className="homepage-section-header">
              <h3>Recent Activity</h3>
              <button className="homepage-view-all">View All <ChevronRight size={16} /></button>
            </div>
            <div className="homepage-activity-list">
              <div className="homepage-activity-item">
                <div className="homepage-activity-icon">
                  <Heart className="homepage-icon-success" />
                </div>
                <div className="homepage-activity-content">
                  <h4>Morning Medicine</h4>
                  <p>Administered on time</p>
                  <span className="homepage-activity-time">Today, 8:45 AM</span>
                </div>
              </div>
              <div className="homepage-activity-item">
                <div className="homepage-activity-icon">
                  <PawPrint className="homepage-icon-success" />
                </div>
                <div className="homepage-activity-content">
                  <h4>Morning Walk</h4>
                  <p>30 minutes, 1.2 miles</p>
                  <span className="homepage-activity-time">Today, 7:15 AM</span>
                </div>
              </div>
              <div className="homepage-activity-item">
                <div className="homepage-activity-icon">
                  <LineChart className="homepage-icon-warning" />
                </div>
                <div className="homepage-activity-content">
                  <h4>Weight Check</h4>
                  <p>65 lbs (+0.5 lbs from last week)</p>
                  <span className="homepage-activity-time">Yesterday, 6:30 PM</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="homepage-sidebar">
          <section className="homepage-notifications">
            <div className="homepage-section-header">
              <h3>Notifications</h3>
              <Bell size={20} />
            </div>
            <div className="homepage-notification-list">
              {notifications.map(notification => (
                <div key={notification.id} className="homepage-notification-item">
                  <p>{notification.message}</p>
                  <span className="homepage-notification-time">{notification.time}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="homepage-quick-actions">
            <div className="homepage-section-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="homepage-actions-grid">
              <button className="homepage-action-button">
                <Calendar size={24} />
                <span>Schedule</span>
              </button>
              <button className="homepage-action-button">
                <PawPrint size={24} />
                <span>Log Walk</span>
              </button>
              <button className="homepage-action-button">
                <LineChart size={24} />
                <span>Track Weight</span>
              </button>
              <button className="homepage-action-button">
                <Settings size={24} />
                <span>Settings</span>
              </button>
            </div>
          </section>

          <section className="homepage-household">
            <div className="homepage-section-header">
              <h3>Household Pets</h3>
            </div>
            <div className="homepage-pet-list">
              <div className="homepage-pet-item homepage-active">
                <div className="homepage-mini-profile">
                  <PawPrint size={16} />
                </div>
                <span>Buddy</span>
              </div>
              <div className="homepage-pet-item">
                <div className="homepage-mini-profile">
                  <PawPrint size={16} />
                </div>
                <span>Luna</span>
              </div>
              <div className="homepage-add-pet">
                <div className="homepage-add-circle">
                  <Plus size={16} />
                </div>
                <span>Add Pet</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default Home;