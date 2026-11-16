
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import {
  ArrowDown, ArrowUpRight, Camera, Check, Instagram, Linkedin,
  LockKeyhole, LogOut, Menu, Plus, Trash2, UploadCloud, X, Play,
  Sparkles, Mic2, Newspaper, Clapperboard, Heart, GraduationCap
} from "lucide-react";
import "./styles.css";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = SUPABASE_URL && SUPABASE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

const HERO_MEDIA_ID = "hero-portrait";

const experiences = [
  {
    id: "news-reporter", number: "01", role: "News Reporter",
    category: "Journalism",
    description: "News reporting and event coverage for news bulletins. Worked on on-field reporting, news gathering, content writing, scriptwriting and voice-over recordings, while also handling cameras and capturing live moments.",
    tags: ["Field reporting", "News writing", "Scriptwriting", "Voice-over"],
    icon: Newspaper
  },
  {
    id: "radio-jockey", number: "02", role: "Radio Jockey & Content Creator",
    category: "Broadcasting",
    description: "Contributed to radio show production, on-air programming, scriptwriting and event coverage. Created audience-focused social media content, reels and promotional campaigns, and supported special shows and digital platforms.",
    tags: ["Radio", "On-air presentation", "Reels", "Campaigns"],
    icon: Mic2
  },
  {
    id: "public-relations", number: "03", role: "Public Relations & Communication",
    category: "Public Relations",
    description: "Handled PR responsibilities at Nalanda Chapter, coordinated events and supported on-ground operations. Contributed to event planning, hosting, execution and communication.",
    tags: ["PR", "Event coordination", "Hosting", "Communication"],
    icon: Sparkles
  },
  {
    id: "event-reporting", number: "04", role: "Event Coverage & Field Reporting",
    category: "Journalism",
    description: "Gathered information on location, fact-checked details, developed stories, wrote content and supported publication to deliver accurate and engaging event coverage.",
    tags: ["Research", "Fact-checking", "Publishing", "Reporting"],
    icon: Camera
  },
  {
    id: "event-manager", number: "05", role: "Event Manager",
    category: "Event Management",
    description: "Managed events from pre-event planning through on-ground execution, including backstage and front-stage operations, celebrity coordination and assistance, and single-camera and multi-camera coverage.",
    tags: ["Planning", "Backstage", "Celebrity management", "Camera operations"],
    icon: Sparkles
  },
  {
    id: "acting", number: "06", role: "Acting & Creative Content",
    category: "Creative Work",
    description: "Worked across theatre, short films and digital platforms. Portrayed a supporting character in the short film Perfectly Imperfect (2025), with experience in performances, reel-making and on-camera content.",
    tags: ["Theatre", "Short films", "Acting", "Digital content"],
    icon: Clapperboard
  },
  {
    id: "radio-writing", number: "07", role: "Radio & Promotional Writing",
    category: "Content",
    description: "Developed RJ links, interview questions and promotional scripts. Participated in radio programming, recording sessions, creative brainstorming, event hosting and celebrity interaction.",
    tags: ["Interview questions", "Promotional scripts", "Recording", "Hosting"],
    icon: Mic2
  },
  {
  id: "cu-campus-connect",
  number: "08",
  role: "Writer – CU Campus Connect",
  category: "Writing",
  description: "Covered campus events through on-ground information gathering, field reporting, fact-checking and content writing. Developed engaging stories and prepared accurate content for publication.",
  tags: ["Event Coverage", "Field Reporting", "Fact-checking", "Content Writing"],
  icon: Newspaper
},
{
  id: "punjab-times",
  number: "09",
  role: "Writer – Punjab Times",
  category: "Writing",
  description: "Contributed news-based and feature articles through research, information gathering and fact-checking. Developed written stories covering current affairs, events and relevant topics for publication.",
  tags: ["News Articles", "Feature Writing", "Research", "Fact-checking"],
  icon: Newspaper
}
];

const socialProjects = [
  {
    id: "heal-globe",
    number: "01",
    title: "Heal the Globe Foundation",
    role: "Social Work Intern",
    place: "Government Primary School, Rosewood City, Sector 49, Gurugram",
    description: "Conducted awareness sessions for children on environmental protection, sanitation, hygiene and basic education through interactive learning activities and discussions."
  },
  {
    id: "sushant-university",
    number: "02",
    title: "Sushant University",
    role: "Hospitality & Tourism Intern",
    place: "Gurugram",
    description: "Gained practical exposure to hospitality and tourism operations, including food preparation, hotel decoration, event setup, guest hospitality and service management."
  }
];

const uploadTargets = [
  { id: "", label: "General Work Gallery", category: "Journalism" },
  { id: HERO_MEDIA_ID, label: "Homepage Portrait", category: "Profile" },
  ...experiences.map(item => ({
    id: item.id,
    label: item.role,
    category: item.category
  })),
  ...socialProjects.map(item => ({
    id: item.id,
    label: item.title,
    category: "Social Work"
  }))
];

function MediaGallery({ items, compact = false }) {
  if (!items.length) {
    return (
      <div className={`media-empty ${compact ? "media-empty-compact" : ""}`}>
        <Camera size={21} />
        <span>Photos and videos will appear here</span>
      </div>
    );
  }

  return (
    <div className="experience-media">
      {items.map(item => (
        <figure className="media-item" key={item.id}>
          {item.media_type === "video" ? (
            <video controls preload="metadata">
              <source src={item.public_url} />
              Your browser does not support video.
            </video>
          ) : (
            <img
              src={item.public_url}
              alt={item.caption || item.title}
              loading="lazy"
            />
          )}
        </figure>
      ))}
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [adminOpen, setAdminOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadTarget, setUploadTarget] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadGallery();

    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => setSession(newSession)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function loadGallery() {
    setLoadingGallery(true);

    if (!supabase) {
      setGallery([]);
      setLoadingGallery(false);
      return;
    }

    const { data, error } = await supabase
      .from("portfolio_media")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setNotice("Gallery could not be loaded. Please check Supabase settings.");
    } else {
      setGallery(data || []);
    }

    setLoadingGallery(false);
  }

  function mediaFor(id) {
    return gallery.filter(item => item.experience_id === id);
  }

  const heroPortrait = mediaFor(HERO_MEDIA_ID).find(
    item => item.media_type !== "video"
  );

  const workGallery = gallery.filter(
    item => item.experience_id !== HERO_MEDIA_ID
  );

  async function signIn(event) {
    event.preventDefault();

    if (!supabase) {
      setNotice("Add your Supabase URL and key to the .env file first.");
      return;
    }

    setLoginBusy(true);
    setNotice("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoginBusy(false);
    setNotice(error ? error.message : "You are signed in.");

    if (!error) setPassword("");
  }

  async function signOut() {
    await supabase?.auth.signOut();
    setNotice("You have been signed out.");
  }

  async function uploadMedia(event) {
    event.preventDefault();

    const file = event.target.elements.mediaFile.files[0];

    if (!file || !supabase || !session) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      setNotice("Please choose an image or video.");
      return;
    }

    if (isVideo && !["video/mp4", "video/webm"].includes(file.type)) {
      setNotice("Please choose an MP4 or WebM video.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setNotice("Please choose a file smaller than 50 MB.");
      return;
    }

    const selectedTarget = uploadTargets.find(
      target => target.id === uploadTarget
    );

    const category = selectedTarget?.category || "Journalism";
    const mediaType = isVideo ? "video" : "image";

    setUploadBusy(true);
    setNotice("");

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${session.user.id}/${Date.now()}-${safeName}`;

    const { error: storageError } = await supabase.storage
      .from("portfolio-media")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type
      });

    if (storageError) {
      setNotice(storageError.message);
      setUploadBusy(false);
      return;
    }

    const { data: publicData } = supabase.storage
      .from("portfolio-media")
      .getPublicUrl(path);

    const { error: dbError } = await supabase
      .from("portfolio_media")
      .insert({
        title: uploadTitle.trim() || file.name.replace(/\.[^.]+$/, ""),
        caption: uploadCaption.trim(),
        category,
        experience_id: uploadTarget || null,
        media_type: mediaType,
        storage_path: path,
        public_url: publicData.publicUrl,
        user_id: session.user.id
      });

    if (dbError) {
      await supabase.storage.from("portfolio-media").remove([path]);
      setNotice(dbError.message);
    } else {
      setNotice("Media uploaded successfully!");
      setUploadTitle("");
      setUploadCaption("");
      event.target.reset();
      await loadGallery();
    }

    setUploadBusy(false);
  }

  async function deleteMedia(item) {
    if (
      !supabase ||
      !window.confirm(`Delete "${item.title}" from the portfolio?`)
    ) return;

    const { error: storageError } = await supabase.storage
      .from("portfolio-media")
      .remove([item.storage_path]);

    if (storageError) {
      setNotice(storageError.message);
      return;
    }

    const { error } = await supabase
      .from("portfolio_media")
      .delete()
      .eq("id", item.id);

    if (error) {
      setNotice(error.message);
    } else {
      setNotice("Media deleted.");
      await loadGallery();
    }
  }

  const categories = useMemo(
    () => [
      "All",
      ...new Set(workGallery.map(item => item.category).filter(Boolean))
    ],
    [workGallery]
  );

  const visibleGallery = filter === "All"
    ? workGallery
    : workGallery.filter(item => item.category === filter);

  return (
    <div className="site-shell">
      <header className="topbar">
        <a
          className="wordmark"
          href="#home"
          onClick={() => setMenuOpen(false)}
        >
          MANASVI<span>.</span>
          <small>JOURNALIST · CREATIVE</small>
        </a>

        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          {["About", "Experience", "Work", "Education", "Community", "Contact"].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}

          <button
            className="admin-link"
            onClick={() => {
              setAdminOpen(true);
              setMenuOpen(false);
            }}
          >
            <LockKeyhole size={14} /> Admin
          </button>
        </nav>
      </header>

      <main>
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-line" />
              JOURNALISM · BROADCASTING · STORYTELLING
            </p>

            <p className="hero-index">PORTFOLIO — 2026</p>

            <h1>
              Stories worth<br />
              <em>telling.</em>
            </h1>

            <p className="hero-subtitle">
              A curious mind. A confident voice.<br />
              A passion for stories that matter.
            </p>

            <p className="hero-description">
              I'm Manasvi, a Journalism and Mass Communication student exploring the world through reporting, radio, creative content and meaningful conversations.
            </p>

            <div className="hero-actions">
              <a className="button button-primary" href="#work">
                Explore my work <ArrowUpRight size={16} />
              </a>
              <a className="text-link" href="#contact">
                Let's connect <ArrowDown size={15} />
              </a>
            </div>

            <div className="hero-socials">
              <a
                href="https://www.linkedin.com/in/manasvi-handa-b12696325/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin size={17} />
              </a>

              <a
                href="https://www.instagram.com/lowkeyymahiii/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <Instagram size={17} />
              </a>

              <span>FOLLOW THE JOURNEY</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-photo-wrap">
              {heroPortrait ? (
                <img
                  className="hero-photo"
                  src={heroPortrait.public_url}
                  alt="Manasvi portrait"
                />
              ) : (
                <div className="photo-placeholder">
                  <Camera size={32} />
                  <strong>Your portrait goes here</strong>
                  <span>Upload it from Admin → Homepage Portrait</span>
                </div>
              )}

              <div className="photo-vertical-label">
                THE ART OF STORYTELLING
              </div>
            </div>

            <div className="hero-stamp">
              <span>THE</span>
              <strong>STORY<br />TELLER</strong>
              <small>EST. 2026</small>
            </div>

            <div className="hero-photo-note">
              BEHIND EVERY STORY, A HUMAN VOICE.
            </div>
          </div>

          {/* Removed the bottom PORTFOLIO / SCROLL TO EXPLORE alignment */}
        </section>

        <section className="intro-section section-wrap" id="about">
          <div className="section-kicker">
            01 <span>/</span> A LITTLE ABOUT ME
          </div>

          <div className="intro-grid">
            <div>
              <p className="oversized-quote">“</p>
              <h2>
                Curiosity leads.<br />
                <em>Stories connect.</em>
              </h2>
            </div>

            <div className="intro-text">
              <p>
                I'm a Journalism and Mass Communication student passionate about storytelling and impactful communication. With hands-on experience in radio broadcasting, public relations, anchoring, content creation and event management, I've worked across content scripting, on-air presentation and PR events.
              </p>

              <p>
                Passionate about creative writing and news anchoring, I bring confidence, curiosity and a genuine interest in connecting with live audiences. I aim to create meaningful media content that resonates across platforms.
              </p>

              <a className="underlined-link" href="#experience">
                Discover my journey <ArrowUpRight size={15} />
              </a>
            </div>
          </div>

          <div className="about-ribbon">
            <span>CURIOUS BY NATURE</span><i />
            <span>CREATIVE BY INSTINCT</span><i />
            <span>STORY-DRIVEN ALWAYS</span>
          </div>
        </section>

        <section className="experience-section" id="experience">
          <div className="section-wrap">
            <div className="section-kicker light-kicker">
              02 <span>/</span> WHAT I DO
            </div>

            <div className="section-heading-row">
              <div>
                <p className="section-overline">A JOURNEY THROUGH MEDIA</p>
                <h2>
                  Experience &<br />
                  <em>exploration.</em>
                </h2>
              </div>

              <p>
                Different formats, one purpose: to communicate with clarity, creativity and a human touch.
              </p>
            </div>

            <div className="experience-list">
              {experiences.map(item => {
                const Icon = item.icon;

                return (
                  <article className="experience-item" key={item.id}>
                    <span className="experience-number">{item.number}</span>

                    <div className="experience-main">
                      <div className="experience-title-line">
                        <span className="experience-category">{item.category}</span>
                        <Icon size={20} />
                      </div>

                      <h3>{item.role}</h3>
                      <p>{item.description}</p>

                      <div className="tag-row">
                        {item.tags.map(tag => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="experience-media-column">
                      <MediaGallery items={mediaFor(item.id)} />
                    </div>

                    <ArrowUpRight className="experience-arrow" size={20} />
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="work-section section-wrap" id="work">
          <div className="section-kicker">
            03 <span>/</span> SELECTED MOMENTS
          </div>

          <div className="section-heading-row work-heading">
            <div>
              <p className="section-overline">THE VISUAL DIARY</p>
              <h2>
                A frame of<br />
                <em>my world.</em>
              </h2>
            </div>

            <p>
              A growing collection of moments from reporting, radio, events and creative projects.
            </p>
          </div>

          <div className="filter-row">
            {categories.map(category => (
              <button
                key={category}
                className={filter === category ? "filter active" : "filter"}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {loadingGallery ? (
            <p className="gallery-message">Loading the gallery…</p>
          ) : visibleGallery.length ? (
            <div className="gallery-grid">
  {visibleGallery.map((item, index) => (
    <article
      className={`gallery-card gallery-card-${index % 4}`}
      key={item.id}
    >
      <div className="gallery-media">
        {item.media_type === "video" ? (
          <video controls preload="metadata">
            <source src={item.public_url} />
          </video>
        ) : (
          <img
            src={item.public_url}
            alt={item.title}
            loading="lazy"
          />
        )}

        {item.media_type === "video" && (
          <span className="video-label">
            <Play size={12} /> VIDEO
          </span>
        )}
      </div>
    </article>
  ))}
</div>
          ) : (
            <div className="empty-gallery">
              <Camera size={28} />
              <p className="section-overline">THE CANVAS IS YOURS</p>
              <h3>Your stories will live here.</h3>
              <p>
                Upload photographs and videos from the Admin dashboard to build this visual diary.
              </p>
            </div>
          )}
        </section>

        <section className="education-section" id="education">
          <div className="section-wrap">
            <div className="section-kicker">
              04 <span>/</span> THE FOUNDATION
            </div>

            <div className="education-grid">
              <div className="education-intro-block">
                <p className="section-overline">ALWAYS LEARNING</p>
                <h2>
                  Learning is<br />
                  <em>always in progress.</em>
                </h2>

                <p className="education-intro">
                  Building a foundation in media, communication and the art of telling stories.
                </p>

                <GraduationCap className="education-icon" size={58} />
              </div>

              <div className="education-list">
                <article>
                  <span>2024 — PRESENT</span>
                  <h3>Chandigarh University</h3>
                  <p>Bachelor of Arts in Journalism and Mass Communication · Mohali</p>
                </article>

                <article>
                  <span>2023 — 2024</span>
                  <h3>Salwan Public School</h3>
                  <p>Higher Secondary Education · CBSE Board</p>
                </article>

                <article>
                  <span>2021 — 2022</span>
                  <h3>Salwan Public School</h3>
                  <p>Secondary Education · CBSE Board</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="community-section section-wrap" id="community">
          <div className="section-kicker">
            05 <span>/</span> BEYOND THE CLASSROOM
          </div>

          <div className="community-heading">
            <div>
              <p className="section-overline">PEOPLE, PLACES & PURPOSE</p>
              <h2>
                Learning through<br />
                <em>people & places.</em>
              </h2>
            </div>
            <Heart size={34} />
          </div>

          <div className="community-grid">
            {socialProjects.map(project => (
              <article className="community-card" key={project.id}>
                <div className="community-card-top">
                  <span>FIELD NOTES / {project.number}</span>
                  <ArrowUpRight size={19} />
                </div>

                <span className="community-role">{project.role}</span>
                <h3>{project.title}</h3>
                <p className="community-place">{project.place}</p>
                <p className="community-description">{project.description}</p>

                <MediaGallery items={mediaFor(project.id)} />
              </article>
            ))}
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-orbit orbit-one" />
          <div className="contact-orbit orbit-two" />

          <div className="section-wrap contact-inner">
            <div className="section-kicker light-kicker">
              06 <span>/</span> LET'S CONNECT
            </div>

            <p className="section-overline">
              HAVE A STORY, IDEA OR OPPORTUNITY?
            </p>

            <h2>
              Every good story<br />
              starts with <em>a hello.</em>
            </h2>

            <p>
              Open to conversations, creative collaborations and opportunities in journalism, broadcasting and media.
            </p>

            <div className="contact-links">
              <div className="contact-details">
              <a 
                href="tel:+918882119814">
               <span>Phone</span>
                +918882119814
              </a>

              <a 
               href="mailto:handamanasvi@gmail.com">
               <span>Email</span>
               handamanasvi@gmail.com
               </a>
              </div>
              <a
                href="https://www.linkedin.com/in/manasvi-handa-b12696325/"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin size={18} /> LinkedIn <ArrowUpRight size={16} />
              </a>

              <a
                href="https://www.instagram.com/lowkeyymahiii/"
                target="_blank"
                rel="noreferrer"
              >
                <Instagram size={18} /> Instagram <ArrowUpRight size={16} />
              </a>
            </div>

            <span className="contact-signoff">
              LET'S MAKE SOMETHING MEANINGFUL.
            </span>
          </div>
        </section>
      </main>

      <footer className="footer section-wrap">
        <a className="wordmark" href="#home">
          MANASVI<span>.</span>
          <small>JOURNALIST · CREATIVE</small>
        </a>

        <span>MADE WITH CURIOSITY & CREATIVITY</span>
        <a href="#home">BACK TO TOP ↑</a>
      </footer>

      {adminOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setAdminOpen(false);
          }}
        >
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-title"
          >
            <button
              className="modal-close"
              onClick={() => setAdminOpen(false)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="admin-heading">
              <span className="admin-icon">
                <LockKeyhole size={18} />
              </span>
              <p className="eyebrow">PRIVATE AREA</p>
              <h2>
                Portfolio <em>studio.</em>
              </h2>
              <p>Your private space to update the stories and visuals.</p>
            </div>

            {!supabase && (
              <div className="setup-warning">
                Supabase is not connected yet. Check your .env file.
              </div>
            )}

            {!session ? (
              <form className="admin-form" onSubmit={signIn}>
                <label>
                  Email address
                  <input
                    type="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </label>

                <label>
                  Password
                  <input
                    type="password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    required
                    placeholder="Your admin password"
                  />
                </label>

                <button
                  className="button button-primary full-button"
                  disabled={loginBusy || !supabase}
                >
                  {loginBusy ? "Signing in…" : "Sign in"}
                </button>
              </form>
            ) : (
              <div className="admin-content">
                <div className="signed-in">
                  <Check size={16} />
                  Signed in as {session.user.email}
                  <button onClick={signOut}>
                    <LogOut size={14} /> Sign out
                  </button>
                </div>

                <form className="admin-form" onSubmit={uploadMedia}>
                  <label>
                    Where should this media appear?
                    <select
                      value={uploadTarget}
                      onChange={event => setUploadTarget(event.target.value)}
                    >
                      {uploadTargets.map(target => (
                        <option
                          key={target.id || "general"}
                          value={target.id}
                        >
                          {target.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Media title
                    <input
                      value={uploadTitle}
                      onChange={event => setUploadTitle(event.target.value)}
                      placeholder="e.g. Reporting at campus event"
                    />
                  </label>

                  <label>
                    Caption (optional)
                    <input
                      value={uploadCaption}
                      onChange={event => setUploadCaption(event.target.value)}
                      placeholder="e.g. On-location reporting"
                    />
                  </label>

                  <label className="file-drop">
                    <UploadCloud size={25} />
                    <strong>Choose a photo or video</strong>
                    <span>
                      JPG, PNG, WebP, GIF, MP4 or WebM · Max 50 MB
                    </span>

                    <input
                      name="mediaFile"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                      required
                    />
                  </label>

                  <button
                    className="button button-primary full-button"
                    disabled={uploadBusy}
                  >
                    {uploadBusy ? (
                      "Uploading…"
                    ) : (
                      <>
                        <Plus size={16} /> Upload media
                      </>
                    )}
                  </button>
                </form>

                <div className="admin-library">
                  <h3>Uploaded media ({gallery.length})</h3>

                  {gallery.map(item => (
                    <div className="admin-image-row" key={item.id}>
                      {item.media_type === "video" ? (
                        <div className="admin-video-icon">
                          <Play size={18} />
                        </div>
                      ) : (
                        <img src={item.public_url} alt="" />
                      )}

                      <span>
                        {item.title}
                        <small>
                          {item.experience_id === HERO_MEDIA_ID
                            ? "Homepage Portrait"
                            : item.category}{" "}
                          · {item.media_type || "image"}
                        </small>
                      </span>

                      <button
                        onClick={() => deleteMedia(item)}
                        aria-label={`Delete ${item.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {notice && (
              <p className="notice" role="status">{notice}</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
