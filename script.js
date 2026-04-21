const form = document.getElementById("searchForm");
const industryInput = document.getElementById("industry");
const hoursInput = document.getElementById("hours");
const resultList = document.getElementById("resultList");
const under10Input = document.getElementById("under10");
const hasVerificationInput = document.getElementById("hasVerification");
const resultCount = document.getElementById("resultCount");
const copyButton = document.getElementById("copyButton");
const copyStatus = document.getElementById("copyStatus");

const sectorDropdownWrapper = document.getElementById("sectorDropdownWrapper");
const sectorToggle = document.getElementById("sectorToggle");
const sectorSummary = document.getElementById("sectorSummary");
const selectedSectors = document.getElementById("selectedSectors");
const sectorHint = document.getElementById("sectorHint");
const sectorCheckboxes = Array.from(document.querySelectorAll("#sectorDropdown input[type='checkbox']"));

const generalGeoTargets = [{
        label: "Bengaluru",
        geoId: "105214831"
    },
    {
        label: "Bangalore",
        geoId: "112376381"
    },
    {
        label: "Hyderabad",
        geoId: "105556991"
    },
    {
        label: "Chennai",
        geoId: "106888327"
    },
    {
        label: "Pune",
        geoId: "114806696"
    }
];

let generatedLinks = [];

function getSelectedSectorData() {
    return sectorCheckboxes
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => ({
            value: checkbox.value,
            label: checkbox.dataset.label || checkbox.parentElement.textContent.trim()
        }));
}

function closeSectorDropdown() {
    sectorDropdownWrapper.classList.remove("open");
    sectorToggle.setAttribute("aria-expanded", "false");
}

function updateSectorSummary() {
    const selections = getSelectedSectorData();

    if (selections.length === 0) {
        sectorSummary.textContent = "Select sectors";
        selectedSectors.innerHTML = "";
        return;
    }

    sectorSummary.textContent = selections.length === 1 ? selections[0].label : selections.length +
        " sectors selected";
    selectedSectors.innerHTML = selections
        .map((sector) => '<span class="sector-chip">' + sector.label + '</span>')
        .join("");
}

function clearSectorSelections() {
    sectorCheckboxes.forEach(function (checkbox) {
        checkbox.checked = false;
    });
    updateSectorSummary();
}

function setSectorAvailability() {
    const isGeneral = industryInput.value === "General";

    sectorToggle.disabled = !isGeneral;
    sectorDropdownWrapper.classList.toggle("dropdown-disabled", !isGeneral);
    sectorHint.textContent = isGeneral ?
        "Sector filters are active for the General preset." :
        "Sector filters are disabled because this industry preset already applies a company filter.";

    if (!isGeneral) {
        clearSectorSelections();
        closeSectorDropdown();
    }
}

function updateLinks() {
    resultList.innerHTML = "";

    const hours = Number(hoursInput.value);
    const industry = industryInput.value;

    if (!Number.isFinite(hours) || hours < 1 || hours > 168) {
        generatedLinks = [];
        resultCount.textContent = "0 links";
        copyButton.disabled = true;
        copyButton.textContent = "Copy first link";
        return;
    }

    let baseUrl =
        "https://www.linkedin.com/jobs/search/?distance=100&keywords=azure%20data%20engineer&origin=JOB_SEARCH_PAGE_JOB_FILTER&refresh=true";
    baseUrl += "&f_TPR=r" + (hours * 3600);

    if (industry === "General") {
        const sectorValues = getSelectedSectorData().map(function (sector) {
            return sector.value;
        });

        if (sectorValues.length > 0) {
            baseUrl += "&f_I=" + sectorValues.join("%2C");
        }
    }

    if (under10Input.checked) {
        baseUrl += "&f_EA=true";
    }

    if (hasVerificationInput.checked) {
        baseUrl += "&f_VJ=true";
    }

    if (industry === "Banking & Financial Services") {
        baseUrl +=
            "&f_C=163379%2C5635%2C5632%2C8888852%2C3797085%2C1123%2C11412006%2C29082158%2C1235%2C21175%2C2603%2C417361%2C10117963%2C1068%2C1067%2C33991104%2C162609%2C92839957%2C33953647%2C164151%2C2967%2C4777%2C68360623";
    } else if (industry === "Fintech & Payments") {
        baseUrl +=
            "&f_C=107766780%2C31237091%2C13183020%2C2267249%2C14485479%2C99914745%2C10813156%2C92862719%2C303524%2C3788927%2C97215080%2C10479149%2C13420511%2C2340144";
    } else if (industry === "IT & Technology Services") {
        baseUrl += "&f_C=76113313%2C3067%2C89835790%2C3586%2C1073%2C1038%2C86813252";
    } else if (industry === "Global Tech & Product (Big Tech)") {
        baseUrl +=
            "&f_C=29078155%2C1028%2C80918929%2C106452776%2C76108196%2C10449749%2C12895978%2C107009595%2C3185%2C1337%2C1480%2C487488%2C10667%2C1586%2C2382910%2C29053421%2C1035%2C1441";
    } else if (industry === "E-commerce & Retail Tech") {
        baseUrl +=
            "&f_C=105938688%2C93383533%2C422813%2C9252341%2C2100709%2C76108196%2C106452776%2C80918929%2C8848940%2C107602587%2C10037698%2C109903136%2C361348%2C321062%2C1353";
    } else if (industry === "Telecom & Connectivity") {
        baseUrl += "&f_C=13652663%2C13361480%2C82860777%2C96630155%2C101308841";
    } else if (industry === "Healthcare & Pharmaceuticals") {
        baseUrl +=
            "&f_C=1663%2C1402010%2C3102%2C28729631%2C1406%2C1043%2C106953064%2C1331952%2C157241%2C28059362%2C28423178%2C29076088%2C41469609%2C5470755%2C607957";
    } else if (industry === "FMCG / Consumer Goods") {
        baseUrl += "&f_C=78028413%2C16271%2C102418423%2C1116%2C1248%2C1393";
    } else if (industry === "Logistics & Transportation") {
        baseUrl += "&f_C=1214%2C479080%2C2312777%2C347965";
    } else if (industry === "Analytics, Data Platforms & Growing Startups") {
        baseUrl +=
            "&f_C=3139796%2C18482523%2C1785481%2C82592055%2C18734010%2C105990038%2C10448588%2C613819%2C3618960%2C18966049%2C5208967";
    }

    generatedLinks = generalGeoTargets.map(function (target) {
        return {
            label: target.label,
            url: baseUrl + "&geoId=" + target.geoId
        };
    });

    generatedLinks.forEach(function (entry) {
        const li = document.createElement("li");
        const link = document.createElement("a");

        link.href = entry.url;
        link.textContent = entry.label;
        link.target = "_blank";
        link.rel = "noreferrer";

        link.addEventListener("click", handleLinkClick);

        li.appendChild(link);
        resultList.appendChild(li);
    });

    resultCount.textContent = generatedLinks.length + " links";
    copyButton.disabled = generatedLinks.length === 0;
    copyButton.textContent = "Copy first link";
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    updateLinks();
});

sectorToggle.addEventListener("click", function () {
    if (sectorToggle.disabled) {
        return;
    }

    const isOpen = sectorDropdownWrapper.classList.toggle("open");
    sectorToggle.setAttribute("aria-expanded", String(isOpen));
});

sectorCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
        updateSectorSummary();
        updateLinks();
    });
});

document.addEventListener("click", function (event) {
    if (!sectorDropdownWrapper.contains(event.target)) {
        closeSectorDropdown();
    }
});

industryInput.addEventListener("change", function () {
    setSectorAvailability();
    updateLinks();
});

hoursInput.addEventListener("input", updateLinks);
under10Input.addEventListener("change", updateLinks);
hasVerificationInput.addEventListener("change", updateLinks);

copyButton.addEventListener("click", async function () {
    if (generatedLinks.length === 0 || !navigator.clipboard) {
        return;
    }

    try {
        await navigator.clipboard.writeText(generatedLinks[0].url);
        copyButton.textContent = "Copied first link";
        copyStatus.textContent = "First generated link copied to clipboard.";
    } catch (error) {
        copyStatus.textContent = "Clipboard copy failed.";
    }
});

async function getFullClientDetails() {
    const detailsEl = document.getElementById("details");
    const nav = navigator;

    // ---------- Basic ----------
    const basic = {
        userAgent: nav.userAgent,
        platform: nav.platform,
        language: nav.language,
        languages: nav.languages,
        cookiesEnabled: nav.cookieEnabled,
        online: nav.onLine
    };

    // ---------- Screen ----------
    const screenDetails = {
        screenWidth: screen.width,
        screenHeight: screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        pixelRatio: window.devicePixelRatio,
        colorDepth: screen.colorDepth
    };

    // ---------- Network ----------
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    const network = {
        type: connection?.effectiveType || null,
        downlink: connection?.downlink || null,
        rtt: connection?.rtt || null
    };

    // ---------- Device Type (derived) ----------
    const ua = nav.userAgent;
    let deviceType = "Desktop";
    if (/Mobi|Android/i.test(ua)) deviceType = "Mobile";
    if (/Tablet|iPad/i.test(ua)) deviceType = "Tablet";

    // ---------- Browser ----------
    let browser = "Unknown";
    if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari")) browser = "Safari";
    else if (ua.includes("Edge")) browser = "Edge";

    // ---------- OS ----------
    let os = "Unknown";
    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac")) os = "MacOS";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

    // ---------- User-Agent Client Hints ----------
    const uaData = {
        platform: nav.userAgentData?.platform || null,
        mobile: nav.userAgentData?.mobile || null,
        brands: nav.userAgentData?.brands || null
    };

    // ---------- Location (permission-based) ----------
    const getLocation = () =>
        new Promise((resolve) => {
            if (!nav.geolocation) return resolve(null);

            nav.geolocation.getCurrentPosition(
                (pos) => {
                    resolve({
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude
                    });
                },
                () => resolve(null),
                { timeout: 3000 }
            );
        });

    const location = await getLocation();

    // ---------- Battery (may not work everywhere) ----------
    let battery = null;
    if (nav.getBattery) {
        try {
            const b = await nav.getBattery();
            battery = {
                level: b.level,
                charging: b.charging
            };
        } catch (e) {
            battery = null;
        }
    }

    return {
        timestamp: new Date().toLocaleString("en-IN", {timeZone: "Asia/Kolkata"}), 
        device_type: deviceType,
        browser: browser,
        os: os,
        user_agent: basic.userAgent,
        platform: basic.platform,
        screen_width: screenDetails.screenWidth,
        screen_height: screenDetails.screenHeight,
        network_type: network?.type || null,
        ua_platform: uaData?.platform || null,
        ua_mobile: uaData?.mobile || null,
        ua_brands: uaData?.brands || null,
        location_latitude: location?.latitude || null,
        location_longitude: location?.longitude || null,
        battery_level: battery?.level || null
    };
}

function detectDevice(userAgent) {
  const ua = (userAgent || "").toLowerCase();

  // Signals
  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  const width = Math.min(window.screen.width, window.innerWidth); // safer
  const isSmallScreen = width <= 768;

  // ---- Phones (prioritize touch + small screen when UA is ambiguous) ----
  if (ua.includes("iphone")) {
    return "apple phone";
  }

  if (ua.includes("android") && (ua.includes("mobile") || isSmallScreen)) {
    return "android phone";
  }

  // Handle spoofed desktop UA on phones (your Android case)
  if (isTouch && isSmallScreen) {
    // Try to infer brand if possible
    if (ua.includes("mac") || ua.includes("iphone") || ua.includes("ipad")) {
      return "apple phone"; // iPhone/iPad in mobile-like viewport
    }
    if (ua.includes("android")) {
      return "android phone";
    }
    // Unknown mobile-like device
    return "android phone"; // pragmatic default for mobile touch devices
  }

  // ---- Laptops / Desktops ----
  if (ua.includes("windows")) {
    return "windows laptop";
  }

  if (ua.includes("mac") && !ua.includes("iphone") && !ua.includes("ipad")) {
    return "mac book";
  }

  // ---- Fallback ----
  return "others";
}

async function handleLinkClick(event) {
    const link = event.target;
    const text = link.textContent;
    const clientDetails = await getFullClientDetails();

    fetch("https://script.google.com/macros/s/AKfycbwB4BhJif85qaW6pJAoXH17GP_aRBOvi06vPG9JNYaBLHur6UgWPXZTGy82Y3d2Gv9L/exec", {
        method: "POST",
        body: JSON.stringify({
            time: clientDetails.timestamp,
            action: "linkedin_opener",
            device: detectDevice(clientDetails.user_agent),
            search_location: text,
            backfill_time: hoursInput.value,
            under10: under10Input.checked,
            hasVerification: hasVerificationInput.checked,
            device_type: clientDetails.device_type,
            browser: clientDetails.browser,
            os: clientDetails.os,
            user_agent: clientDetails.user_agent,
            platform: clientDetails.platform,
            screen_width: clientDetails.screen_width + 'x' + clientDetails.screen_height,
            network_type: clientDetails.network_type,
            ua_platform: clientDetails.ua_platform,
            ua_mobile: clientDetails.ua_mobile,
            ua_brands: clientDetails.ua_brands,
            location_latitude: clientDetails.location_latitude + ' , ' + clientDetails.location_longitude,
            battery_level: clientDetails.battery_level,
        })
    });
}

setSectorAvailability();
updateSectorSummary();
updateLinks();
