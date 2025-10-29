import React, { useState, useEffect } from 'react';
import './Viewer.css';

const Viewer = () => {
  const [activeSection, setActiveSection] = useState('documents');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const [documentModalVisible, setDocumentModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [layoutView, setLayoutView] = useState('list'); // default to 'list' view
  const [nameSort, setNameSort] = useState('none'); // 'none' | 'asc' | 'desc'
  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  const [dateFilterAnchor, setDateFilterAnchor] = useState(null); // 'list' | 'grid' | null
  // dateFilterRanges: array of { start: Date, end: Date } ranges to match any
  const [dateFilterRanges, setDateFilterRanges] = useState([]);
  // date range pickers state
  const [fromSel, setFromSel] = useState({ year: null, month: null, day: null, level: null });
  const [toSel, setToSel] = useState({ year: null, month: null, day: null, level: null });
  const [activePicker, setActivePicker] = useState(null); // 'from'|'to'|null
  const [pickerView, setPickerView] = useState('year'); // 'year'|'months'|'days'
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [tempYear, setTempYear] = useState(null);
  const [tempMonth, setTempMonth] = useState(null);
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null); // display name of the selected preset (e.g. "Custom date range")

  const openPicker = (which) => {
    setActivePicker(which);
    setPickerView('year');
    const sel = which === 'from' ? fromSel : toSel;
    const cy = new Date().getFullYear();
    setTempYear(sel.year || cy);
    setTempMonth(sel.month != null ? sel.month : 0);
  };

  const selectYearForPicker = (year) => {
    if (activePicker === 'from') {
      // set From year
      setFromSel({ year, month: null, day: null, level: 'year' });
      // if To year is not set or is earlier than the new From year, auto-adjust To to match From
      if (!toSel || !toSel.year || toSel.year < year) {
        setToSel({ year, month: null, day: null, level: 'year' });
      }
      setTempYear(year);
      // set calendar to start of selected year so months/days reflect the chosen year
      setCalendarMonth(new Date(year, 0, 1));
      // after selecting year, show months (and then days) for that year
      setPickerView('months');
    } else {
      // selecting To year: ensure To >= From. If user picks an earlier year, reset To to From year
      let adjusted = year;
      if (fromSel && fromSel.year && year < fromSel.year) {
        adjusted = fromSel.year;
      }
      setToSel({ year: adjusted, month: null, day: null, level: 'year' });
      setTempYear(adjusted);
      setCalendarMonth(new Date(adjusted, 0, 1));
      setPickerView('months');
    }
  };

  const selectMonthForPicker = (monthIndex) => {
    if (activePicker === 'from') setFromSel(prev => ({ ...prev, year: tempYear, month: monthIndex, day: null, level: 'month' }));
    else setToSel(prev => ({ ...prev, year: tempYear, month: monthIndex, day: null, level: 'month' }));
    setTempMonth(monthIndex);
    setPickerView('days');
    setCalendarMonth(new Date(tempYear, monthIndex, 1));
  };

  const selectDayForPicker = (day) => {
    if (activePicker === 'from') setFromSel({ year: tempYear, month: tempMonth, day, level: 'day' });
    else setToSel({ year: tempYear, month: tempMonth, day, level: 'day' });
    // remain in days view so user can change
  };

  const closePicker = () => {
    setActivePicker(null);
    setPickerView('year');
  };

  // Helpers for calendar and relative date ranges
  const startOfDay = (d) => {
    const r = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    r.setHours(0,0,0,0);
    return r;
  };

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const buildCalendarDays = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay(); // 0-6 Sun-Sat
    const totalDays = daysInMonth(year, month);
    const days = [];
    // push blanks for firstWeekday
    for (let i = 0; i < firstWeekday; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) days.push(new Date(year, month, d));
    return days;
  };

  const prevMonth = () => setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const nextMonth = () => setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  const handleSelectDate = (date) => {
    const s = startOfDay(date);
    if (activePicker === 'from') {
      setFromSel(prev => ({ ...prev, year: s.getFullYear(), month: s.getMonth(), day: s.getDate(), level: 'day' }));
    } else if (activePicker === 'to') {
      setToSel(prev => ({ ...prev, year: s.getFullYear(), month: s.getMonth(), day: s.getDate(), level: 'day' }));
    }
  };

  const clearDateFilter = () => {
    setFromSel({ year: null, month: null, day: null, level: null });
    setToSel({ year: null, month: null, day: null, level: null });
    setDateFilterRanges([]);
    setActivePicker(null);
    setPickerView('year');
    setDateFilterOpen(false);
    setShowCustomRange(false);
    setSelectedPreset(null);
  };

  const applyPreset = (preset) => {
    const today = startOfDay(new Date());
    let start = null;
    let end = null;
    if (preset === 'today') {
      start = today; end = today;
    } else if (preset === 'last7') {
      end = today;
      start = startOfDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6));
    } else if (preset === 'last30') {
      end = today;
      start = startOfDay(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29));
    } else if (preset === 'thisYear') {
      const y = today.getFullYear();
      start = startOfDay(new Date(y, 0, 1));
      end = startOfDay(new Date(y, 11, 31));
    } else if (preset === 'lastYear') {
      const y = today.getFullYear() - 1;
      start = startOfDay(new Date(y, 0, 1));
      end = startOfDay(new Date(y, 11, 31));
    } else if (preset === 'custom') {
      // show custom range UI but do not apply yet
      setShowCustomRange(true);
      setActivePicker('from');
      setPickerView('year');
      return;
    }

    // Apply computed preset range
    const ranges = [];
    if (start || end) ranges.push({ start, end });
    setDateFilterRanges(ranges);
    setDateFilterOpen(false);
    setDateFilterAnchor(null);
    setShowCustomRange(false);
  };

  const setRelativeRange = (option) => {
    // not used in range-only popup
    return;
  };

  const applyDateSelections = () => {
    // compose ranges from fromSel and toSel
    const ranges = [];
    const today = startOfDay(new Date());
    const makeStart = (sel) => {
      if (!sel || !sel.year) return null;
      if (sel.level === 'year') return startOfDay(new Date(sel.year, 0, 1));
      if (sel.level === 'month') return startOfDay(new Date(sel.year, sel.month, 1));
      if (sel.level === 'day') return startOfDay(new Date(sel.year, sel.month, sel.day));
      return null;
    };
    const makeEnd = (sel) => {
      if (!sel || !sel.year) return null;
      if (sel.level === 'year') return startOfDay(new Date(sel.year, 11, 31));
      if (sel.level === 'month') return startOfDay(new Date(sel.year, sel.month, daysInMonth(sel.year, sel.month)));
      if (sel.level === 'day') return startOfDay(new Date(sel.year, sel.month, sel.day));
      return null;
    };

    const start = makeStart(fromSel);
    const end = makeEnd(toSel);
    if (start || end) {
      ranges.push({ start, end });
    }
    setDateFilterRanges(ranges);
    setDateFilterOpen(false);
  };

  // Note: dropdown will be absolutely positioned inside the header's relative container

  const documents = [
    {
      id: 1,
      title: 'Annual Expense Statement',
      description: 'Summary for university programs and events',
      date: '01/15/2024',
      size: '2.3 MB',
      type: 'Financial Report',
      tag: 'financial',
      file: 'sample1.pdf'
    },
    {
      id: 2,
      title: 'Fund & Asset Turnover - Semester 1',
      description: 'Detailed turnover report for departments',
      date: '01/10/2024',
      size: '1.1 MB',
      type: 'Turnover of Funds & Assets',
      tag: 'turnover',
      file: 'sample2.pdf'
    },
    {
      id: 3,
      title: 'Q3 Official Receipt File',
      description: 'All official receipts for third quarter budget',
      date: '12/20/2023',
      size: '1.8 MB',
      type: 'Official Receipt',
      tag: 'receipt',
      file: 'sample3.pdf'
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesFilter = activeFilter === 'all' || doc.tag === activeFilter;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Apply date filter if set (supports multiple ranges)
  const applyDateFilter = (docs) => {
    if (!dateFilterRanges || dateFilterRanges.length === 0) return docs;
    return docs.filter((doc) => {
      // doc.date format: MM/DD/YYYY
      const parts = doc.date.split('/');
      const d = new Date(parts[2], Number(parts[0]) - 1, parts[1]);
      d.setHours(0,0,0,0);
      return dateFilterRanges.some(({ start, end }) => {
        if (start && end) return d >= start && d <= end;
        if (start && !end) return d >= start;
        if (!start && end) return d <= end;
        return false;
      });
    });
  };

  // Apply name sort
  const applyNameSort = (docs) => {
    if (nameSort === 'none') return docs;
    const sorted = [...docs].sort((a,b) => a.title.localeCompare(b.title));
    if (nameSort === 'asc') return sorted;
    return sorted.reverse();
  }

  // Compose final list: base filters -> date filter -> sorting
  const finalDocuments = applyNameSort(applyDateFilter(filteredDocuments));

  // Load pinned state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sidebarPinned");
    if (saved === "true") {
      setIsPinned(true);
      setIsExpanded(true);
    }
  }, []);

  // Save pinned state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebarPinned", isPinned);
  }, [isPinned]);

  const handleMenuClick = (section) => {
    setActiveSection(section);
    // Close mobile sidebar after navigation
    if (window.innerWidth <= 768) {
      setIsMobileOpen(false);
    }
  };

  // Advanced sidebar mouse handlers
  const handleMouseEnter = () => {
    if (!isPinned && window.innerWidth > 768) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned && window.innerWidth > 768) {
      setIsExpanded(false);
    }
  };

  // Toggle pin state or mobile drawer
  const handleSidebarToggle = () => {
    if (window.innerWidth <= 768) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsPinned(!isPinned);
      if (!isPinned) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
      }
    }
  };

  // Close mobile sidebar when clicking overlay
  const handleOverlayClick = () => {
    setIsMobileOpen(false);
  };

  // Reusable function for sidebar icon clicks - expands sidebar before performing action
  const handleIconClick = (action) => {
    if (!isExpanded && !isPinned && window.innerWidth > 768) {
      setIsExpanded(true);
    }
    action();
  };

  // Handle keyboard navigation for menu items
  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleIconClick(action);
    }
  };

  const handleProfileClick = () => {
    setProfileDropdownVisible(!profileDropdownVisible);
  };

  const handleViewDocument = (doc) => {
    setSelectedDocument(doc);
    setDocumentModalVisible(true);
  };

  const handleCloseModal = () => {
    setDocumentModalVisible(false);
    setSelectedDocument({});
  };

  const handleDownload = (file) => {
    // Implement download logic here
    console.log('Downloading:', file);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    sessionStorage.clear();
    
    // Clear any cached data
    setActiveSection('documents');
    setProfileDropdownVisible(false);
    setDocumentModalVisible(false);
    setSelectedDocument({});
    setSearchQuery('');
    setActiveFilter('all');
    
    // Show logout message
    alert('You have been successfully logged out.');
    
    // Redirect to login page
    window.location.href = '/login';
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
    setProfileDropdownVisible(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownVisible && !event.target.closest('.account')) {
        setProfileDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownVisible]);

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleSidebarClickOutside = (event) => {
      if (window.innerWidth <= 768 && 
          isMobileOpen && 
          !event.target.closest('.sidebar') && 
          !event.target.closest('.collapse-btn')) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleSidebarClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleSidebarClickOutside);
    };
  }, [isMobileOpen]);

  // Handle window resize to manage sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobileOpen(false);
        setIsExpanded(false);
      } else {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on mount
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={handleOverlayClick}
        ></div>
      )}

      <div className={`dashboard-container ${
        isMobileOpen
          ? 'mobile-sidebar-open'
          : isExpanded || isPinned
          ? 'sidebar-expanded'
          : 'sidebar-collapsed'
      }`}>
        {/* ADVANCED COLLAPSIBLE SIDEBAR */}
        <aside 
          className={`sidebar ${
            isMobileOpen
              ? 'mobile-open'
              : isExpanded || isPinned
              ? 'expanded'
              : 'collapsed'
          }`} 
          id="sidebar"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="sidebar-header">
            <div className="brand-group">
              <h2 className="brand" style={{ color: 'white' }}>TransparaTech</h2>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                gap: '8px'
              }}>
                <p className="subtext" style={{ color: '#B8B8B8' }}>Viewer</p>
                <button 
                  className={`collapse-btn ${isPinned ? 'pinned' : ''}`}
                  onClick={handleSidebarToggle}
                  aria-expanded={isExpanded || isPinned}
                  aria-label={window.innerWidth <= 768 ? "Toggle mobile menu" : (isPinned ? "Unpin sidebar" : "Pin sidebar")}
                  title={window.innerWidth <= 768 ? "Toggle menu" : (isPinned ? "Unpin sidebar" : "Pin sidebar")}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '16px',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '24px',
                    height: '24px'
                  }}
                >
                  <i className={`bx ${window.innerWidth <= 768 ? 'bx-menu' : (isPinned ? 'bx-pin' : 'bx-chevrons-right')}`}></i>
                </button>
              </div>
            </div>
          </div>

        <nav className="sidebar-menu" role="navigation" aria-label="Main">
          <button 
            className={`menu-item ${activeSection === 'documents' ? 'active' : ''}`}
            onClick={() => handleIconClick(() => handleMenuClick('documents'))}
            onKeyDown={(e) => handleKeyDown(e, () => handleMenuClick('documents'))}
            type="button"
            aria-label="Documents"
            aria-pressed={activeSection === 'documents'}
          >
            <i className="bx bxs-file-doc"></i>
            <span>Documents</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <p className="watermark">© TransparaTech</p>
          <button 
            className="signout-btn small" 
            onClick={() => handleIconClick(handleLogout)}
            type="button"
            aria-label="Sign out"
          >
            <i className="bx bx-log-out"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="left-actions">
            <h1 className="page-title">
              <strong style={{ fontSize: '1.3em' }}>Documents</strong>
            </h1>
          </div>

          <div className="center-actions">
           
          </div>

          <div className="right-actions">
            {/* PROFILE SECTION */}
            <div className="account">
              <img 
                src="/api/placeholder/40/40" 
                alt="User" 
                className="profile-img" 
                onClick={handleProfileClick}
              />
              <div className={`account-dropdown ${profileDropdownVisible ? 'visible' : ''}`}>
                <div className="account-info">
                  <img src="/api/placeholder/42/42" alt="User" />
                  <div className="details">
                    <span className="name">John Doe</span>
                    <span className="email">john.doe@example.com</span>
                    <span className="role">Viewer</span>
                  </div>
                </div>
                <div className="divider"></div>
                <button onClick={handleLogout}>Log Out</button>
              </div>
            </div>
          </div>
        </header>

        {/* DOCUMENTS SECTION */}
        <section 
          id="documentsSection" 
          className={`section ${activeSection !== 'documents' ? 'hidden' : ''}`}
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            width: '100%'
          }}
        >
          {/* Budget Overview */}
          <div style={{ marginBottom: '60px', marginTop: '30px' }}>
            <h2 style={{ 
              fontWeight: 900, 
              fontSize: '1.2em', 
              marginBottom: '20px', 
              color: 'var(--deep)',
              textAlign: 'center'
            }}>Budget Overview</h2>
            <div className="stats-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              justifyContent: 'center',
              alignItems: 'stretch'
            }}>
              <div className="stat-card no-hover" style={{ 
                padding: '24px 20px', 
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center',
                background: '#ffffff',
                boxShadow: '0 2px 8px var(--card-shadow)',
                transform: 'none',
                transition: 'none',
                cursor: 'default'
              }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: '12px' }}>Total Expenses</h3>
                <p style={{ fontSize: '1.4em', fontWeight: '600' }}>₱565,000</p>
              </div>
              <div className="stat-card no-hover" style={{ 
                padding: '24px 20px', 
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center',
                background: '#ffffff',
                boxShadow: '0 2px 8px var(--card-shadow)',
                transform: 'none',
                transition: 'none',
                cursor: 'default'
              }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: '12px' }}>Total Budget</h3>
                <p style={{ fontSize: '1.4em', fontWeight: '600' }}>₱800,000</p>
              </div>
              <div className="stat-card no-hover" style={{ 
                padding: '24px 20px', 
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center',
                background: '#ffffff',
                boxShadow: '0 2px 8px var(--card-shadow)',
                transform: 'none',
                transition: 'none',
                cursor: 'default'
              }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: '12px' }}>Remaining Budget</h3>
                <p style={{ fontSize: '1.4em', fontWeight: '600' }}>₱235,000</p>
              </div>
            </div>
          </div>
          <div className="section-header" style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            gap: '20px', 
            marginBottom: '32px',
            padding: '0 16px',
            justifyContent: 'center'
          }}>
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              alignItems: 'center', 
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              width: '100%',
              maxWidth: '1100px'
            }}>
              <input 
                type="text" 
                placeholder="Search documents..." 
                className="search-bar" 
                style={{ 
                  width: '280px',
                  minWidth: '240px',
                  maxWidth: '100%'
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/* Layout toggle beside search bar */}
              <div className="view-toggle" role="toolbar" aria-label="Toggle layout" style={{ marginRight: '12px' }}>
                <button
                  type="button"
                  className={`view-toggle-btn ${layoutView === 'grid' ? 'active' : ''}`}
                  onClick={() => setLayoutView('grid')}
                  aria-pressed={layoutView === 'grid'}
                  title="Grid view"
                >
                  <i className="bx bx-grid-alt" aria-hidden="true"></i>
                  <span className="sr-only">Grid view</span>
                </button>
                <button
                  type="button"
                  className={`view-toggle-btn ${layoutView === 'list' ? 'active' : ''}`}
                  onClick={() => setLayoutView('list')}
                  aria-pressed={layoutView === 'list'}
                  title="List view"
                >
                  <i className="bx bx-list-ul" aria-hidden="true"></i>
                  <span className="sr-only">List view</span>
                </button>
              </div>
              <div className="doc-filters" style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginLeft: '12px'
              }}>
                <button 
                  className={`filter ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`filter ${activeFilter === 'financial' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('financial')}
                >
                  Financial Report
                </button>
                <button 
                  className={`filter ${activeFilter === 'turnover' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('turnover')}
                >
                  Turnover
                </button>
                <button 
                  className={`filter ${activeFilter === 'receipt' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('receipt')}
                >
                  Official Receipt
                </button>
              </div>
            </div>
          </div>

          {/* Documents: render grid or list depending on layoutView */}
          {layoutView === 'grid' ? (
            <div>
              {/* Grid header with Name and Date filters to mirror list header */}
              <div className="grid-header" role="row" style={{ marginTop: 12, marginBottom: 12 }}>
                <div className="col col-name clickable" role="columnheader" aria-sort={nameSort === 'none' ? 'none' : nameSort} onClick={() => setNameSort(nameSort === 'asc' ? 'desc' : 'asc')} title="Sort by name">
                  Name
                  <span style={{ marginLeft: 8 }}>
                    {nameSort === 'asc' ? (
                      <i className="bx bx-sort-alphabet-down" style={{ color: '#8f98dc' }}></i>
                    ) : nameSort === 'desc' ? (
                      <i className="bx bx-sort-alt-2" style={{ color: '#122090' }}></i>
                    ) : (
                      <i className="bx bx-sort-alt-2" style={{ color: 'inherit', opacity: 0.6 }}></i>
                    )}
                  </span>
                </div>

                <div className="col col-date" role="columnheader" style={{ position: 'relative' }}>
                  <button
                    className={`date-header-btn`}
                    onClick={() => {
                      const open = !(dateFilterOpen && dateFilterAnchor === 'grid');
                      setDateFilterOpen(open);
                      setDateFilterAnchor(open ? 'grid' : null);
                      setShowCustomRange(false);
                      setSelectedPreset(null);
                    }}
                    aria-expanded={dateFilterOpen && dateFilterAnchor === 'grid'}
                    title="Filter by date"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  >
                    Date
                    <i className="bx bx-chevron-down" aria-hidden="true" style={{ marginLeft: 6 }}></i>
                  </button>

                  {dateFilterOpen && dateFilterAnchor === 'grid' && (
                    <div className="date-filter-dropdown" style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 9999, maxHeight: '60vh', overflow: 'auto' }}>
                      <button className="close-x" onClick={() => { setDateFilterOpen(false); setDateFilterAnchor(null); setShowCustomRange(false); setSelectedPreset(null); }} aria-label="Close">&times;</button>
                      <div style={{ fontSize: '0.95rem', padding: 8 }}>
                        {/* small local style for keyframes/animation (Tailwind utility used for layout) */}
                        <style>{`
                          @keyframes slide-in { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                          .animate-slide-in { animation: slide-in 300ms ease forwards; }
                        `}</style>

                        <div className="bg-white rounded-md shadow-sm p-3 w-80 md:w-96">
                          <div className="flex flex-col md:flex-row gap-3">
                            {/* Left: presets */}
                            <div className="flex-1">
                              <div className="flex flex-col divide-y divide-gray-100 rounded-md overflow-hidden">
                                <button className="text-left px-3 py-2 hover:bg-[#f1f5ff] focus:outline-none" onClick={() => { setSelectedPreset('Today'); applyPreset('today'); }}>Today</button>
                                <button className="text-left px-3 py-2 hover:bg-[#f1f5ff] focus:outline-none" onClick={() => { setSelectedPreset('Last 7 days'); applyPreset('last7'); }}>Last 7 days</button>
                                <button className="text-left px-3 py-2 hover:bg-[#f1f5ff] focus:outline-none" onClick={() => { setSelectedPreset('Last 30 days'); applyPreset('last30'); }}>Last 30 days</button>
                                <button className="text-left px-3 py-2 hover:bg-[#f1f5ff] focus:outline-none" onClick={() => { setSelectedPreset('This year'); applyPreset('thisYear'); }}>This year</button>
                                <button className="text-left px-3 py-2 hover:bg-[#f1f5ff] focus:outline-none" onClick={() => { setSelectedPreset('Last year'); applyPreset('lastYear'); }}>Last year</button>
                                <button className="text-left px-3 py-2 hover:bg-[#f1f5ff] focus:outline-none" onClick={() => { setSelectedPreset('Custom date range'); applyPreset('custom'); }}>{'Custom date range'}</button>
                              </div>

                              {/* Footer under presets: show 3 buttons unless custom is active */}
                              <div className="mt-3">
                                {selectedPreset === 'Custom date range' ? (
                                  <div className="">
                                    <button className="text-sm text-left text-gray-600" onClick={() => { clearDateFilter(); setDateFilterAnchor(null); setSelectedPreset(null); }}>Clear all</button>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-3 items-center gap-2">
                                    <div className="justify-self-start">
                                      <button className="text-sm text-gray-600" onClick={() => { clearDateFilter(); setDateFilterAnchor(null); setSelectedPreset(null); }}>Clear all</button>
                                    </div>
                                    <div className="justify-self-center">
                                      <button className="text-sm text-gray-600" onClick={() => { setDateFilterOpen(false); setDateFilterAnchor(null); setSelectedPreset(null); }}>Cancel</button>
                                    </div>
                                    <div className="justify-self-end">
                                      <button className="text-sm font-semibold text-white bg-[#122090] px-3 py-1 rounded" onClick={() => { applyDateSelections(); setDateFilterOpen(false); setDateFilterAnchor(null); setSelectedPreset(null); }}>Apply</button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Vertical divider (desktop) */}
                            <div className="hidden md:block w-px bg-gray-200"></div>

                            {/* Right: custom panel - only render when selectedPreset === "Custom date range" */}
                            {selectedPreset === 'Custom date range' && (
                              <div className={`w-full md:w-80 bg-white rounded-md p-3 shadow-sm animate-slide-in transition-all duration-300`}>
                                <div className="flex flex-col gap-3">
                                  <div className="flex gap-3">
                                    <div className="flex flex-col gap-1">
                                      <label className="text-xs text-gray-700">From</label>
                                      <button className="picker-input border px-2 py-1 rounded" onClick={() => openPicker('from')}>{fromSel && fromSel.year ? (fromSel.level === 'day' ? new Date(fromSel.year, fromSel.month, fromSel.day).toLocaleDateString() : (fromSel.level === 'month' ? new Date(fromSel.year, fromSel.month, 1).toLocaleString(undefined, { month: 'short', year: 'numeric' }) : String(fromSel.year))) : 'Select'}</button>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <label className="text-xs text-gray-700">To</label>
                                      <button className="picker-input border px-2 py-1 rounded" onClick={() => openPicker('to')}>{toSel && toSel.year ? (toSel.level === 'day' ? new Date(toSel.year, toSel.month, toSel.day).toLocaleDateString() : (toSel.level === 'month' ? new Date(toSel.year, toSel.month, 1).toLocaleString(undefined, { month: 'short', year: 'numeric' }) : String(toSel.year))) : 'Select'}</button>
                                    </div>
                                  </div>

                                  {/* Picker rendering re-used as-is */}
                                  {activePicker && (
                                    <div className="mt-2">
                                      {pickerView === 'year' && (
                                        <div className="year-list">
                                          {(() => {
                                            const cy = new Date().getFullYear();
                                            const years = [];
                                            for (let y = cy; y >= cy - 50; y--) years.push(y);
                                            return years.map(y => (
                                              <button key={y} className={`year-btn ${tempYear === y ? 'selected' : ''}`} onClick={() => selectYearForPicker(y)}>{y}</button>
                                            ));
                                          })()}
                                        </div>
                                      )}

                                      {pickerView === 'months' && (
                                        <div className="months-grid">
                                          {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, idx) => {
                                            const disableMonthForTo = activePicker === 'to' && fromSel && fromSel.year && tempYear === fromSel.year && (fromSel.month != null) && idx < fromSel.month;
                                            const cls = `month-btn ${tempMonth === idx ? 'selected' : ''} ${disableMonthForTo ? 'disabled' : ''}`;
                                            return (
                                              <button
                                                key={m}
                                                className={cls}
                                                disabled={disableMonthForTo}
                                                onClick={() => { if (!disableMonthForTo) selectMonthForPicker(idx); }}
                                              >
                                                {m}
                                              </button>
                                            );
                                          })}

                                          <div className="months-actions">
                                            <button className="picker-action-btn" onClick={() => { if (activePicker === 'from') setFromSel({ year: tempYear, month: null, day: null, level: 'year' }); else setToSel({ year: tempYear, month: null, day: null, level: 'year' }); setActivePicker(null); }}>Select Year Only</button>
                                            <button className="picker-action-btn" onClick={() => setPickerView('year')}>Back</button>
                                          </div>
                                        </div>
                                      )}

                                      {pickerView === 'days' && (
                                        <div>
                                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 24px)', gap: 6, marginBottom: 6 }}>
                                            {['S','M','T','W','T','F','S'].map(d => <div key={d} style={{ fontSize: '0.72rem', color:'#444', textAlign:'center' }}>{d}</div>)}
                                          </div>
                                          <div className="cal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 24px)', gap: 6 }}>
                                            {buildCalendarDays(new Date(tempYear, tempMonth, 1)).map((dt, idx) => {
                                              if (!dt) return <div key={idx}></div>;
                                              const dayNum = dt.getDate();
                                              const disableDayForTo = activePicker === 'to' && fromSel && fromSel.year && fromSel.month != null && fromSel.day != null && tempYear === fromSel.year && tempMonth === fromSel.month && dayNum < fromSel.day;
                                              const sel = (activePicker === 'from' && fromSel.year === tempYear && fromSel.month === tempMonth && fromSel.day === dayNum) || (activePicker === 'to' && toSel.year === tempYear && toSel.month === tempMonth && toSel.day === dayNum);
                                              const cls = `day ${sel ? 'selected' : ''} ${disableDayForTo ? 'disabled' : ''}`;
                                              return <div key={idx} onClick={() => { if (!disableDayForTo) selectDayForPicker(dayNum); }} className={cls} style={{ width:24, height:24, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:4, background: sel ? '#1A237E' : '#fff', color: sel ? '#FFC107' : '#000', cursor: disableDayForTo ? 'default' : 'pointer' }}>{dayNum}</div>
                                            })}
                                          </div>
                                          <div style={{ marginTop: 8, display:'flex', justifyContent:'space-between', gap: 8 }}>
                                            <button className="picker-action-btn" onClick={() => setPickerView('months')}>Back</button>
                                            <button className="picker-action-btn" onClick={() => setActivePicker(null)}>Done</button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Apply/Cancel moved here when custom is active */}
                                  <div className="flex justify-end gap-2 mt-2">
                                    <button className="text-sm text-gray-600" onClick={() => { setShowCustomRange(false); setSelectedPreset(null); }}>Cancel</button>
                                    <button className="text-sm font-semibold text-white bg-[#122090] px-3 py-1 rounded" onClick={() => { applyDateSelections(); setDateFilterOpen(false); setDateFilterAnchor(null); setShowCustomRange(false); setSelectedPreset(null); }}>Apply</button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="col col-size"></div>
                <div className="col col-type"></div>
                <div className="col col-actions"></div>
              </div>


              <div className="documents-list">
                {finalDocuments.map((doc) => (
                  <div key={doc.id} className="doc-card" data-tag={doc.tag}>
                    <i className="bx bxs-file-pdf doc-icon"></i>
                    <div className="doc-content">
                      <span className="doc-title">{doc.title}</span>
                      <span className="doc-desc">
                        <br />
                        {doc.description}
                      </span>
                      <span className="doc-meta">
                        <br />
                        {doc.date} · {doc.size} · PDF<br />
                      </span>
                      <span className="doc-type">{doc.type}</span>
                    </div>
                    <div className="doc-actions">
                      <button 
                        className="view-btn"
                        onClick={() => handleViewDocument(doc)}
                      >
                        View
                      </button>
                      <button 
                        className="download-btn" 
                        onClick={() => handleDownload(doc.file)}
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="documents-list list-view">
              <div className="list-table" role="table" aria-label="Documents list">
                {/* Header row */}
                <div className="list-header" role="row">
                  <div
                    className="col col-name clickable"
                    onClick={() => setNameSort(nameSort === 'asc' ? 'desc' : 'asc')}
                    role="columnheader"
                    aria-sort={nameSort === 'none' ? 'none' : nameSort}
                    title="Sort by name"
                  >
                    Name
                    <span style={{ marginLeft: 8 }}>
                      {nameSort === 'asc' ? (
                        <i className="bx bx-sort-alphabet-down" style={{ color: '#8f98dc' }}></i>
                      ) : nameSort === 'desc' ? (
                        <i className="bx bx-sort-alt-2" style={{ color: '#122090' }}></i>
                      ) : (
                        <i className="bx bx-sort-alt-2" style={{ color: 'inherit', opacity: 0.6 }}></i>
                      )}
                    </span>
                  </div>
                  <div className="col col-date" role="columnheader" style={{ position: 'relative' }}>
                    <button
                      className={`date-header-btn`}
                      onClick={() => {
                          const open = !(dateFilterOpen && dateFilterAnchor === 'list');
                          setDateFilterOpen(open);
                          setDateFilterAnchor(open ? 'list' : null);
                          setShowCustomRange(false);
                          setSelectedPreset(null);
                      }}
                      aria-expanded={dateFilterOpen && dateFilterAnchor === 'list'}
                      title="Filter by date"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    >
                      Date
                      <i className="bx bx-chevron-down" aria-hidden="true" style={{ marginLeft: 6 }}></i>
                    </button>

                    {dateFilterOpen && dateFilterAnchor === 'list' && (
                      <div className="date-filter-dropdown" style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 9999, maxHeight: '60vh', overflow: 'auto' }}>
                        <button className="close-x" onClick={() => { setDateFilterOpen(false); setDateFilterAnchor(null); setShowCustomRange(false); setSelectedPreset(null); }} aria-label="Close">&times;</button>
                        <div style={{ fontSize: '0.95rem', padding: 8 }}>
                          <style>{`
                            @keyframes slide-in { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                            .animate-slide-in { animation: slide-in 300ms ease forwards; }
                          `}</style>

                          <div className="bg-white rounded-md shadow-sm p-3 w-80 md:w-96">
                            <div className="flex flex-col md:flex-row gap-3">
                              <div className="flex-1">
                                <div className="flex flex-col divide-y divide-gray-100 rounded-md overflow-hidden">
                                  <button className="text-left px-3 py-2 hover:bg-[#f1f5ff] focus:outline-none" onClick={() => { setSelectedPreset('Today'); applyPreset('today'); }}>Today</button>
                                  <button className="text-left px-3 py-2 hover:bg-[#f1f5ff] focus:outline-none" onClick={() => { setSelectedPreset('Last 7 days'); applyPreset('last7'); }}>Last 7 days</button>
                                  <button className="text-left px-3 py-2 hover:bg-[#f1f5ff] focus:outline-none" onClick={() => { setSelectedPreset('Last 30 days'); applyPreset('last30'); }}>Last 30 days</button>
                                  <button className="text-left px-3 py-2 hover:bg-[#f1f5ff] focus:outline-none" onClick={() => { setSelectedPreset('This year'); applyPreset('thisYear'); }}>This year</button>
                                  <button className="text-left px-3 py-2 hover:bg-[#f1f5ff] focus:outline-none" onClick={() => { setSelectedPreset('Last year'); applyPreset('lastYear'); }}>Last year</button>
                                  <button className="text-left px-3 py-2 hover:bg-[#f1f5ff] focus:outline-none" onClick={() => { setSelectedPreset('Custom date range'); applyPreset('custom'); }}>{'Custom date range'}</button>
                                </div>

                                <div className="mt-3">
                                  {selectedPreset === 'Custom date range' ? (
                                    <div>
                                      <button className="text-sm text-left text-gray-600" onClick={() => { clearDateFilter(); setDateFilterAnchor(null); setSelectedPreset(null); }}>Clear all</button>
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-3 items-center gap-2">
                                      <div className="justify-self-start">
                                        <button className="text-sm text-gray-600" onClick={() => { clearDateFilter(); setDateFilterAnchor(null); setSelectedPreset(null); }}>Clear all</button>
                                      </div>
                                      <div className="justify-self-center">
                                        <button className="text-sm text-gray-600" onClick={() => { setDateFilterOpen(false); setDateFilterAnchor(null); setSelectedPreset(null); }}>Cancel</button>
                                      </div>
                                      <div className="justify-self-end">
                                        <button className="text-sm font-semibold text-white bg-[#122090] px-3 py-1 rounded" onClick={() => { applyDateSelections(); setDateFilterOpen(false); setDateFilterAnchor(null); setSelectedPreset(null); }}>Apply</button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="hidden md:block w-px bg-gray-200"></div>

                              {selectedPreset === 'Custom date range' && (
                                <div className={`w-full md:w-80 bg-white rounded-md p-3 shadow-sm animate-slide-in transition-all duration-300`}>
                                  <div className="flex flex-col gap-3">
                                    <div className="flex gap-3">
                                      <div className="flex flex-col gap-1">
                                        <label className="text-xs text-gray-700">From</label>
                                        <button className="picker-input border px-2 py-1 rounded" onClick={() => openPicker('from')}>{fromSel && fromSel.year ? (fromSel.level === 'day' ? new Date(fromSel.year, fromSel.month, fromSel.day).toLocaleDateString() : (fromSel.level === 'month' ? new Date(fromSel.year, fromSel.month, 1).toLocaleString(undefined, { month: 'short', year: 'numeric' }) : String(fromSel.year))) : 'Select'}</button>
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <label className="text-xs text-gray-700">To</label>
                                        <button className="picker-input border px-2 py-1 rounded" onClick={() => openPicker('to')}>{toSel && toSel.year ? (toSel.level === 'day' ? new Date(toSel.year, toSel.month, toSel.day).toLocaleDateString() : (toSel.level === 'month' ? new Date(toSel.year, toSel.month, 1).toLocaleString(undefined, { month: 'short', year: 'numeric' }) : String(toSel.year))) : 'Select'}</button>
                                      </div>
                                    </div>

                                    {activePicker && (
                                      <div className="mt-2">
                                        {pickerView === 'year' && (
                                          <div className="year-list">
                                            {(() => {
                                              const cy = new Date().getFullYear();
                                              const years = [];
                                              for (let y = cy; y >= cy - 50; y--) years.push(y);
                                              return years.map(y => (
                                                <button key={y} className={`year-btn ${tempYear === y ? 'selected' : ''}`} onClick={() => selectYearForPicker(y)}>{y}</button>
                                              ));
                                            })()}
                                          </div>
                                        )}

                                        {pickerView === 'months' && (
                                          <div className="months-grid">
                                            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, idx) => {
                                              const disableMonthForTo = activePicker === 'to' && fromSel && fromSel.year && tempYear === fromSel.year && (fromSel.month != null) && idx < fromSel.month;
                                              const cls = `month-btn ${tempMonth === idx ? 'selected' : ''} ${disableMonthForTo ? 'disabled' : ''}`;
                                              return (
                                                <button
                                                  key={m}
                                                  className={cls}
                                                  disabled={disableMonthForTo}
                                                  onClick={() => { if (!disableMonthForTo) selectMonthForPicker(idx); }}
                                                >
                                                  {m}
                                                </button>
                                              );
                                            })}

                                            <div className="months-actions">
                                              <button className="picker-action-btn" onClick={() => { if (activePicker === 'from') setFromSel({ year: tempYear, month: null, day: null, level: 'year' }); else setToSel({ year: tempYear, month: null, day: null, level: 'year' }); setActivePicker(null); }}>Select Year Only</button>
                                              <button className="picker-action-btn" onClick={() => setPickerView('year')}>Back</button>
                                            </div>
                                          </div>
                                        )}

                                        {pickerView === 'days' && (
                                          <div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 24px)', gap: 6, marginBottom: 6 }}>
                                              {['S','M','T','W','T','F','S'].map(d => <div key={d} style={{ fontSize: '0.72rem', color:'#444', textAlign:'center' }}>{d}</div>)}
                                            </div>
                                            <div className="cal-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 24px)', gap: 6 }}>
                                              {buildCalendarDays(new Date(tempYear, tempMonth, 1)).map((dt, idx) => {
                                                if (!dt) return <div key={idx}></div>;
                                                const dayNum = dt.getDate();
                                                const disableDayForTo = activePicker === 'to' && fromSel && fromSel.year && fromSel.month != null && fromSel.day != null && tempYear === fromSel.year && tempMonth === fromSel.month && dayNum < fromSel.day;
                                                const sel = (activePicker === 'from' && fromSel.year === tempYear && fromSel.month === tempMonth && fromSel.day === dayNum) || (activePicker === 'to' && toSel.year === tempYear && toSel.month === tempMonth && toSel.day === dayNum);
                                                const cls = `day ${sel ? 'selected' : ''} ${disableDayForTo ? 'disabled' : ''}`;
                                                return <div key={idx} onClick={() => { if (!disableDayForTo) selectDayForPicker(dayNum); }} className={cls} style={{ width:24, height:24, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:4, background: sel ? '#1A237E' : '#fff', color: sel ? '#FFC107' : '#000', cursor: disableDayForTo ? 'default' : 'pointer' }}>{dayNum}</div>
                                              })}
                                            </div>
                                            <div style={{ marginTop: 8, display:'flex', justifyContent:'space-between', gap: 8 }}>
                                              <button className="picker-action-btn" onClick={() => setPickerView('months')}>Back</button>
                                              <button className="picker-action-btn" onClick={() => setActivePicker(null)}>Done</button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    <div className="flex justify-end gap-2 mt-2">
                                      <button className="text-sm text-gray-600" onClick={() => { setShowCustomRange(false); setSelectedPreset(null); }}>Cancel</button>
                                      <button className="text-sm font-semibold text-white bg-[#122090] px-3 py-1 rounded" onClick={() => { applyDateSelections(); setDateFilterOpen(false); setDateFilterAnchor(null); setShowCustomRange(false); setSelectedPreset(null); }}>Apply</button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col col-size">File Size</div>
                  <div className="col col-type">File Type</div>
                  <div className="col col-actions" aria-hidden="true"></div>
                </div>

                {/* Data rows */}
                {finalDocuments.map((doc) => (
                  <div key={doc.id} className="doc-row" role="row" data-tag={doc.tag}>
                    <div className="col col-name" role="cell">
                      <div className="doc-left">
                        <i className="bx bxs-file-pdf doc-icon" aria-hidden="true"></i>
                        <div className="doc-info">
                          <span className="doc-title">{doc.title}</span>
                          <span className="doc-desc small-desc">{doc.description}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col col-date" role="cell">{doc.date}</div>
                    <div className="col col-size" role="cell">{doc.size}</div>
                    <div className="col col-type" role="cell">{doc.type}</div>
                    <div className="col col-actions" role="cell">
                      <div className="doc-actions">
                        <button 
                          className="view-btn"
                          onClick={() => handleViewDocument(doc)}
                        >
                          View
                        </button>
                        <button 
                          className="download-btn" 
                          onClick={() => handleDownload(doc.file)}
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About Member Access Information Card */}
          <div className="w-full max-w-full mx-auto mt-8 mb-12 bg-white border-l-4 border-l-[#122090] rounded-lg shadow-sm border border-gray-200 p-6" style={{ margin: '2rem 0 3rem 0' }}>
            <h3 className="text-lg font-semibold text-[#122090] mb-4">
              About Member Access
            </h3>
            
            <p className="text-gray-700 text-base leading-relaxed mb-6">
              As a member of <strong>Information Systems and Information Technology Education</strong>, you have view-only access to all documents submitted by your organization.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-sm mt-1 flex-shrink-0">✓</span>
                <span className="text-gray-700 text-base leading-relaxed">
                  View all documents submitted by your organization
                </span>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-sm mt-1 flex-shrink-0">✓</span>
                <span className="text-gray-700 text-base leading-relaxed">
                  Track approval status and progress
                </span>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="text-green-500 text-sm mt-1 flex-shrink-0">✓</span>
                <span className="text-gray-700 text-base leading-relaxed">
                  Download approved certificates
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* VIEW MODAL */}
      {documentModalVisible && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedDocument.title}</h3>
              <button className="close-modal" onClick={handleCloseModal}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>{selectedDocument.description}</p>
              <div className="file-preview">📄 File Preview (Coming Soon)</div>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Logout</h3>
              <button className="close-modal" onClick={cancelLogout}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to log out? Any unsaved changes will be lost.</p>
              <div className="logout-actions">
                <button 
                  className="confirm-logout-btn"
                  onClick={confirmLogout}
                >
                  Yes, Log Out
                </button>
                <button 
                  className="cancel-logout-btn"
                  onClick={cancelLogout}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default Viewer;
