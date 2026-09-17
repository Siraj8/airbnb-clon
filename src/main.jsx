import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft, ArrowRight, ChevronDown, Globe, Heart, Menu, Search,
  Share, SlidersHorizontal, Star, X, Minus, Plus
} from "lucide-react";
import "./styles.css";
import listing from "./data.json";

const photos = listing.photos;

function App() {
  const [tourOpen, setTourOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [liked, setLiked] = useState(false);
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const [guestOpen, setGuestOpen] = useState(false);

  const totalGuests = guests.adults + guests.children;
  const total = useMemo(() => {
    const nights = 5;
    return listing.pricePerNight * nights + listing.cleaningFee + listing.serviceFee;
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex(i => (i + 1) % photos.length);
      if (e.key === "ArrowLeft") setLightboxIndex(i => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex]);

  const openPhoto = (index) => setLightboxIndex(index);

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <div className="brand" aria-label="Airbnb home">
            <span className="brand-mark">⌂</span>
            <span>airbnb</span>
          </div>

          <div className="top-search">
            <button>Anywhere</button>
            <span className="divider" />
            <button>Any week</button>
            <span className="divider" />
            <button className="guest-search">Add guests</button>
            <span className="search-circle"><Search size={17}/></span>
          </div>

          <div className="header-actions">
            <button className="host-btn">Airbnb your home</button>
            <button className="icon-btn" aria-label="Language"><Globe size={18}/></button>
            <button className="profile-btn" aria-label="Menu">
              <Menu size={18}/><span className="avatar">A</span>
            </button>
          </div>
        </div>
      </header>

      <main className="page">
        <div className="title-row">
          <div>
            <h1>{listing.title}</h1>
            <div className="subline">
              <span><Star size={14} fill="currentColor"/> {listing.rating}</span>
              <span>·</span><span>{listing.reviews} reviews</span>
              <span>·</span><span>{listing.location}</span>
            </div>
          </div>
          <div className="title-actions">
            <button onClick={() => navigator.clipboard?.writeText(window.location.href)}><Share size={16}/> Share</button>
            <button onClick={() => setLiked(!liked)}><Heart size={16} fill={liked ? "currentColor" : "none"}/> {liked ? "Saved" : "Save"}</button>
          </div>
        </div>

        <section className="hero-grid" aria-label="Photo gallery">
          <button className="hero-main photo-button" onClick={() => openPhoto(0)}>
            <img src={photos[0]} alt="Main property" />
          </button>
          <button className="photo-button" onClick={() => openPhoto(1)}><img src={photos[1]} alt="Property" /></button>
          <button className="photo-button" onClick={() => openPhoto(2)}><img src={photos[2]} alt="Property" /></button>
          <button className="photo-button" onClick={() => openPhoto(3)}><img src={photos[3]} alt="Property" /></button>
          <div className="last-photo-wrap">
            <button className="photo-button" onClick={() => openPhoto(4)}><img src={photos[4]} alt="Property" /></button>
            <button className="show-all" onClick={() => setTourOpen(true)}>Show all photos</button>
          </div>
        </section>

        <div className="content-grid">
          <section className="details">
            <div className="host-summary">
              <div>
                <h2>{listing.type} hosted by {listing.host}</h2>
                <p>{listing.guests} guests · {listing.beds} bedrooms · {listing.bedsCount} beds · {listing.baths} baths</p>
              </div>
              <div className="host-avatar">{listing.hostInitial}</div>
            </div>

            <div className="feature-list">
              {listing.highlights.map((item) => (
                <div className="feature" key={item.title}>
                  <div className="feature-icon">{item.icon}</div>
                  <div><strong>{item.title}</strong><p>{item.text}</p></div>
                </div>
              ))}
            </div>

            <p className="description">{listing.description}</p>
            <button className="link-btn">Show more <span>→</span></button>

            <hr />

            <h2>Where you'll sleep</h2>
            <div className="sleep-card">
              <img src={photos[5]} alt="Bedroom" />
              <strong>Bedroom</strong>
              <span>1 queen bed</span>
            </div>

            <hr />

            <h2>What this place offers</h2>
            <div className="amenities">
              {listing.amenities.map((a) => <div key={a} className="amenity">{a}</div>)}
            </div>
            <button className="outline-btn">Show all {listing.amenities.length} amenities</button>
          </section>

          <aside className="booking-card">
            <div className="price"><strong>${listing.pricePerNight}</strong> night</div>
            <div className="rating-mini"><Star size={13} fill="currentColor"/> {listing.rating} · {listing.reviews} reviews</div>

            <div className="date-box">
              <div><small>CHECK-IN</small><strong>Jun 12, 2026</strong></div>
              <div><small>CHECKOUT</small><strong>Jun 17, 2026</strong></div>
            </div>

            <div className="guest-box" onClick={() => setGuestOpen(!guestOpen)}>
              <div><small>GUESTS</small><strong>{totalGuests} guest{totalGuests !== 1 ? "s" : ""}{guests.infants ? `, ${guests.infants} infant` : ""}</strong></div>
              <ChevronDown size={18}/>
              {guestOpen && (
                <div className="guest-popover" onClick={(e) => e.stopPropagation()}>
                  {[
                    ["adults","Adults","Ages 13 or above"],
                    ["children","Children","Ages 2–12"],
                    ["infants","Infants","Under 2"]
                  ].map(([key,label,desc]) => (
                    <div className="guest-row" key={key}>
                      <div><strong>{label}</strong><span>{desc}</span></div>
                      <div className="stepper">
                        <button disabled={key === "adults" && guests[key] <= 1} onClick={() => setGuests(g => ({...g,[key]:Math.max(key==="adults"?1:0,g[key]-1)}))}><Minus size={14}/></button>
                        <span>{guests[key]}</span>
                        <button onClick={() => setGuests(g => ({...g,[key]:g[key]+1}))}><Plus size={14}/></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="reserve-btn">Reserve</button>
            <p className="no-charge">You won't be charged yet</p>

            <div className="cost-row"><span>${listing.pricePerNight} × 5 nights</span><span>${listing.pricePerNight * 5}</span></div>
            <div className="cost-row"><span>Cleaning fee</span><span>${listing.cleaningFee}</span></div>
            <div className="cost-row"><span>Airbnb service fee</span><span>${listing.serviceFee}</span></div>
            <hr/>
            <div className="total-row"><strong>Total before taxes</strong><strong>${total}</strong></div>
          </aside>
        </div>
      </main>

      {tourOpen && (
        <div className="tour-overlay">
          <div className="tour-top">
            <button className="close-btn" onClick={() => setTourOpen(false)}><X/></button>
            <span>Photo tour</span>
            <button className="tour-count" onClick={() => {setTourOpen(false);setLightboxIndex(0)}}>{photos.length} photos</button>
          </div>
          <div className="tour-grid">
            {photos.map((src,i) => <button key={src} onClick={() => {setTourOpen(false);setLightboxIndex(i)}}><img src={src} alt={`Gallery ${i+1}`}/></button>)}
          </div>
        </div>
      )}

      {lightboxIndex !== null && (
        <div className="lightbox" role="dialog" aria-modal="true">
          <button className="light-close" onClick={() => setLightboxIndex(null)} aria-label="Close"><X/></button>
          <button className="nav-arrow left" onClick={() => setLightboxIndex(i => (i-1+photos.length)%photos.length)} aria-label="Previous"><ArrowLeft/></button>
          <img src={photos[lightboxIndex]} alt={`Photo ${lightboxIndex+1}`} />
          <button className="nav-arrow right" onClick={() => setLightboxIndex(i => (i+1)%photos.length)} aria-label="Next"><ArrowRight/></button>
          <div className="light-counter">{lightboxIndex + 1} / {photos.length}</div>
        </div>
      )}
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
