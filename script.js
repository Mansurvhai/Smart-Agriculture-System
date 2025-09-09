// Function to create a post element and display it
function displayPost(post, containerId, isProfilePage = false) {
    const postsContainer = document.getElementById(containerId);
    if (!postsContainer) return;

    const postElement = document.createElement("div");
    postElement.classList.add("post");
    postElement.setAttribute("data-post-id", post.id);

    let postContent = `
        <div class="post-header">
            <span class="post-user">${post.username}</span>
            <span class="post-timestamp">${post.timestamp}</span>
            ${isProfilePage ? `<button class="delete-btn">মুছুন</button>` : ''}
        </div>
        <p>${post.text}</p>
    `;

    if (post.imageUrl) {
        postContent += `<img src="${post.imageUrl}" alt="Post Image" class="post-image">`;
    }

    postElement.innerHTML = postContent;
    postsContainer.prepend(postElement);

    if (isProfilePage) {
        postElement.querySelector('.delete-btn').addEventListener('click', function () {
            deletePost(post.id);
        });
    }
}

// Function to load posts from localStorage
function loadPosts(containerId, userId = null) {
    const allPosts = JSON.parse(localStorage.getItem("userPosts")) || [];
    let postsToDisplay = allPosts;

    if (userId) {
        postsToDisplay = allPosts.filter(post => post.userId === userId);
    }

    const postsContainer = document.getElementById(containerId);
    if (postsContainer) {
        postsContainer.innerHTML = '';
        const isProfilePage = window.location.pathname.includes("profile.html");
        postsToDisplay.forEach(post => displayPost(post, containerId, isProfilePage));
    }
}

// Function to delete a post by its unique ID
function deletePost(postId) {
    let posts = JSON.parse(localStorage.getItem("userPosts")) || [];
    posts = posts.filter(post => post.id != postId);
    localStorage.setItem("userPosts", JSON.stringify(posts));

    const storedUser = JSON.parse(localStorage.getItem("digitalFarmingUser"));
    if (storedUser) {
        loadPosts('posts', storedUser.mobile);
    }
    loadPosts('communityPosts');
    alert("পোস্ট সফলভাবে মুছে ফেলা হয়েছে!");
}

// Global Logout button
const logoutButtons = document.querySelectorAll("#logoutBtn");
if (logoutButtons) {
    logoutButtons.forEach(button => {
        button.addEventListener("click", function () {
            localStorage.removeItem("digitalFarmingUser");
            alert("সফলভাবে লগ আউট হয়েছেন!");
            window.location.href = "signin.html";
        });
    });
}

// LANDING PAGE LOGIC
if (window.location.pathname.includes("index.html")) {
    window.addEventListener('load', () => {
        loadPosts('communityPosts');
    });
}

// SIGN UP
const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let fullName = document.getElementById("fullName").value;
        let mobile = document.getElementById("mobile").value;
        let divisionSelect = document.getElementById("division");
        let division = divisionSelect.options[divisionSelect.selectedIndex].textContent; // পরিবর্তন এখানে
        let district = document.getElementById("district").value;
        let upazila = document.getElementById("upazila").value;
        let password = document.getElementById("password").value;
        let rePassword = document.getElementById("rePassword").value;

        if (password !== rePassword) {
            alert("পাসওয়ার্ড দুটি মিলছে না!");
            return;
        }

        let user = { fullName, mobile, division, district, upazila, password };
        localStorage.setItem("digitalFarmingUser", JSON.stringify(user));
        alert("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! অনুগ্রহ করে সাইন ইন করুন।");
        window.location.href = "signin.html";
    });
}

// Division -> District Mapping (Translated to Bangla)
const districtsByDivision = {
    Dhaka: ["ঢাকা", "গাজীপুর", "কিশোরগঞ্জ", "মানিকগঞ্জ", "মুন্সিগঞ্জ", "নারায়ণগঞ্জ", "নরসিংদী", "টাঙ্গাইল", "ফরিদপুর", "গোপালগঞ্জ", "মাদারীপুর", "রাজবাড়ী", "শরীয়তপুর"],
    Chattogram: ["চট্টগ্রাম", "কক্সবাজার", "বান্দরবান", "রাঙ্গামাটি", "খাগড়াছড়ি", "নোয়াখালী", "ফেনী", "লক্ষ্মীপুর", "ব্রাহ্মণবাড়িয়া", "কুমিল্লা", "চাঁদপুর"],
    Khulna: ["খুলনা", "বাগেরহাট", "সাতক্ষীরা", "যশোর", "ঝিনাইদহ", "মাগুরা", "নড়াইল", "চুয়াডাঙ্গা", "কুষ্টিয়া", "মেহেরপুর"],
    Rajshahi: ["রাজশাহী", "পাবনা", "সিরাজগঞ্জ", "বগুড়া", "জয়পুরহাট", "নওগাঁ", "নাটোর", "চাঁপাইনবাবগঞ্জ"],
    Barishal: ["বরিশাল", "ভোলা", "পটুয়াখালী", "ঝালকাঠি", "পিরোজপুর", "বরগুনা"],
    Sylhet: ["সিলেট", "হবিগঞ্জ", "মৌলভীবাজার", "সুনামগঞ্জ"],
    Mymensingh: ["ময়মনসিংহ", "নেত্রকোনা", "শেরপুর", "জামালপুর"],
    Rangpur: ["রংপুর", "দিনাজপুর", "কুড়িগ্রাম", "লালমনিরহাট", "গাইবান্ধা", "নীলফামারী", "ঠাকুরগাঁও", "পঞ্চগড়"]
};

const divisionSelect = document.getElementById("division");
const districtSelect = document.getElementById("district");

if (divisionSelect && districtSelect) {
    divisionSelect.addEventListener("change", function () {
        const selectedDivision = this.value;
        districtSelect.innerHTML = `<option value="">জেলা নির্বাচন করুন</option>`;

        if (districtsByDivision[selectedDivision]) {
            districtsByDivision[selectedDivision].forEach(district => {
                let option = document.createElement("option");
                option.value = district;
                option.textContent = district;
                districtSelect.appendChild(option);
            });
        }
    });
}

// SIGN IN
const signinForm = document.getElementById("signinForm");
if (signinForm) {
    signinForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let mobile = document.getElementById("loginMobile").value;
        let password = document.getElementById("loginPassword").value;

        let storedUser = JSON.parse(localStorage.getItem("digitalFarmingUser"));

        if (storedUser && storedUser.mobile === mobile && storedUser.password === password) {
            alert("স্বাগতম, " + storedUser.fullName + "!");
            window.location.href = "dashboard.html";
        } else {
            alert("মোবাইল নম্বর বা পাসওয়ার্ড ভুল!");
        }
    });
}

// DASHBOARD
if (window.location.pathname.includes("dashboard.html")) {
    const storedUser = JSON.parse(localStorage.getItem("digitalFarmingUser"));
    if (!storedUser) {
        alert("আপনাকে প্রথমে লগ ইন করতে হবে!");
        window.location.href = "signin.html";
    } else {
        document.getElementById("welcomeMsg").innerText = `আসসালামু আলাইকুম, কৃষি বন্ধু!, ${storedUser.fullName} 🌾`;
        document.getElementById("locationInfo").innerText = `📍 ঠিকানা: ${storedUser.upazila}, ${storedUser.district}, ${storedUser.division}`;

        const coords = {
            Dhaka: { lat: 23.8103, lon: 90.4125 },
            Chattogram: { lat: 22.3569, lon: 91.7832 },
            Khulna: { lat: 22.8456, lon: 89.5403 },
            Rajshahi: { lat: 24.3745, lon: 88.6042 },
            Barishal: { lat: 22.7010, lon: 90.3535 },
            Sylhet: { lat: 24.8918, lon: 91.8687 },
            Mymensingh: { lat: 24.7471, lon: 90.4203 },
            Rangpur: { lat: 25.7439, lon: 89.2752 }
        };

        const loc = storedUser.division;
        const { lat, lon } = coords[loc] || coords['Dhaka'];

        const weatherEl = document.getElementById("weatherInfo");
        const hourlyContainer = document.getElementById("hourly-forecast-container");

        const weatherCodeMap = {
            0: './icons/sun.png', 1: './icons/sun.png', 2: './icons/rainy.png', 3: './icons/rainy.png',
            45: './icons/rainy.png', 48: './icons/rainy.png', 51: './icons/rainy.png', 53: './icons/rainy.png',
            55: './icons/heavy-rain.png', 56: './icons/rainy.png', 57: './icons/heavy-rain.png',
            61: './icons/rainy.png', 63: './icons/rainy.png', 65: './icons/heavy-rain.png',
            66: './icons/rainy.png', 67: './icons/heavy-rain.png', 71: './icons/snow.png',
            73: './icons/snow.png', 75: './icons/snow.png', 77: './icons/snow.png',
            80: './icons/rainy.png', 81: './icons/rainy.png', 82: './icons/heavy-rain.png',
            85: './icons/snow.png', 86: './icons/snow.png', 95: './icons/storm.png',
            96: './icons/thunderstorm.png', 99: './icons/thunderstorm.png'
        };

        const displayWeatherIcon = (weatherCode) => {
            const iconUrl = weatherCodeMap[weatherCode] || './icons/sun.png';
            return `<img src="${iconUrl}" alt="weather icon" class="weather-icon">`;
        };

        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&forecast_days=1`)
            .then(res => res.json())
            .then(data => {
                const currentWeather = data.current_weather;
                const hourlyData = data.hourly;
                const now = new Date();
                const currentHour = now.getHours();
                const todayName = now.toLocaleDateString('bn-BD', { weekday: 'long' });

                weatherEl.innerHTML = `
                    <div class="weather-info-main">
                        <div class="temp-icon">
                            <span class="temp">${Math.round(currentWeather.temperature)}°সে</span>
                            ${displayWeatherIcon(currentWeather.weathercode)}
                        </div>
                        <div class="details">
                            <span>${todayName}</span>
                            <span>বৃষ্টিপাতের সম্ভাবনা: ০%</span>
                            <span>আর্দ্রতা: ${hourlyData.relative_humidity_2m[currentHour]}%</span>
                            <span>বাতাস: ${currentWeather.windspeed} কিমি/ঘন্টা</span>
                        </div>
                    </div>
                `;

                hourlyContainer.innerHTML = '';
                for (let i = 0; i < hourlyData.time.length; i++) {
                    const time = new Date(hourlyData.time[i]);
                    const hour = time.getHours();
                    const temp = Math.round(hourlyData.temperature_2m[i]);
                    const weatherCode = hourlyData.weather_code[i];
                    const hourlyCard = document.createElement('div');
                    hourlyCard.classList.add('hourly-card');
                    hourlyCard.innerHTML = `
                        <span>${i === 0 ? 'এখন' : `${hour}:00`}</span>
                        ${displayWeatherIcon(weatherCode)}
                        <span class="temp-range">${temp}°</span>
                    `;
                    hourlyContainer.appendChild(hourlyCard);
                }
            })
            .catch(err => {
                weatherEl.innerHTML = `<p>আবহাওয়ার তথ্য লোড করা সম্ভব হয়নি।</p>`;
                console.error(err);
            });

        const newsFeedEl = document.getElementById("newsFeed");
        const bangladeshFarmingNews = [
            { title: "ফসল সংক্রান্ত খবর", summary: "ধান, গম, ভুট্টা, সবজি, ফলমূলের বাজারমূল্য।", url: "https://chaldal.com/fresh-vegetable" },
            { title: "এই মৌসুমে রেকর্ড পাট উৎপাদনের আশা করা হচ্ছে", summary: "অনুকূল আবহাওয়া এবং আধুনিক চাষ পদ্ধতির কারণে পাটের রেকর্ড ফলনের সম্ভাবনা দেখা দিয়েছে, যা স্থানীয় অর্থনীতিকে চাঙ্গা করবে।", url: "https://www.facebook.com/" },
            { title: "নতুন মোবাইল অ্যাপ কৃষকদের ফসলের রোগ পরিচালনায় সহায়তা করছে", summary: "একটি স্থানীয় প্রযুক্তি সংস্থা একটি এআই-চালিত অ্যাপ তৈরি করেছে যা ছবির মাধ্যমে সাধারণ ফসলের রোগ শনাক্ত করতে পারে এবং তাৎক্ষণিক সমাধান ও বিশেষজ্ঞের পরামর্শ প্রদান করে।", url: "https://www.facebook.com/" }
        ];
        newsFeedEl.innerHTML = '';
        bangladeshFarmingNews.forEach(news => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card';
            newsCard.innerHTML = `<h4><a href="${news.url}" target="_blank">${news.title}</a></h4><p>${news.summary}</p>`;
            newsFeedEl.appendChild(newsCard);
        });

        const soilInfo = "বাংলাদেশের মাটি মূলত আলুভিয়াল, উর্বর এবং বিভিন্ন ফসলের জন্য উপযুক্ত। তবে আঞ্চলিক পার্থক্য রয়েছে, যেমন বারিন্দ ট্র্যাক্টের লাল মাটি। পুষ্টি ঘাটতি নির্ধারণ করতে মাটি পরীক্ষার পরামর্শ দেওয়া হয়।";
        const chemicalInfo = "ধানের জন্য, সুষম NPK সার ব্যবহার করা উচিত। প্রতিটি অঞ্চলের সাধারণ কীটপতঙ্গ অনুযায়ী নির্দিষ্ট কীটনাশক ব্যবহার করার জন্য স্থানীয় কৃষি সম্প্রসারণ অফিসের পরামর্শ নিন। সবসময় নিরাপত্তা নির্দেশিকা মেনে চলুন।";
        const seasonalCropInfo = {
            'Rabi (শীতকাল)': 'বরো ধান, গম, আলু, ভুট্টা, ডাল (মসুর, ছোলা)',
            'Kharif-1 (প্রি-মন্সুন)': 'আউস ধান, পাট, মুগ ডাল',
            'Kharif-2 (বর্ষাকাল)': 'আমন ধান, চিনি আখ, টি-আমন ধান'
        };
        const getSeasonalInfo = () => {
            const date = new Date();
            const month = date.getMonth() + 1;
            if (month >= 11 || month <= 2) return `**রবি (শীতকাল):** ${seasonalCropInfo['Rabi (শীতকাল)']}`;
            if (month >= 3 && month <= 6) return `**খরিফ-১ (প্রি-মন্সুন):** ${seasonalCropInfo['Kharif-1 (প্রি-মন্সুন)']}`;
            return `**খরিফ-২ (বর্ষাকাল):** ${seasonalCropInfo['Kharif-2 (বর্ষাকাল)']}`;
        };
        document.getElementById('soilInfo').innerHTML = soilInfo;
        document.getElementById('chemicalInfo').innerHTML = chemicalInfo;
        document.getElementById('seasonalCropInfo').innerHTML = getSeasonalInfo();
    }
}

// PROFILE PAGE LOGIC
if (window.location.pathname.includes("profile.html")) {
    const storedUser = JSON.parse(localStorage.getItem("digitalFarmingUser"));
    const postForm = document.getElementById("postForm");
    const profileImageInput = document.getElementById("profileImageInput");
    const profilePhoto = document.getElementById("profilePhoto");

    if (!storedUser) {
        alert("আপনাকে প্রথমে লগ ইন করতে হবে!");
        window.location.href = "signin.html";
    } else {
        document.getElementById("profileName").innerText = storedUser.fullName;
        document.getElementById("profileMobile").innerText = storedUser.mobile;
        document.getElementById("profileUpazila").innerText = storedUser.upazila;
        document.getElementById("profileDistrict").innerText = storedUser.district;
        document.getElementById("profileDivision").innerText = storedUser.division;

        const storedProfilePic = localStorage.getItem("profilePic_" + storedUser.mobile);
        if (storedProfilePic) {
            profilePhoto.src = storedProfilePic;
        }

        profileImageInput.addEventListener("change", function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    profilePhoto.src = e.target.result;
                    localStorage.setItem("profilePic_" + storedUser.mobile, e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });

        loadPosts('posts', storedUser.mobile);

        postForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const postText = document.getElementById("postText").value;
            const postImageFile = document.getElementById("postImage").files[0];

            const newPost = {
                id: Date.now(),
                userId: storedUser.mobile,
                username: storedUser.fullName,
                text: postText,
                timestamp: new Date().toLocaleString(),
                imageUrl: null
            };

            if (postImageFile) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    newPost.imageUrl = event.target.result;
                    saveAndDisplayPost(newPost);
                };
                reader.readAsDataURL(postImageFile);
            } else {
                saveAndDisplayPost(newPost);
            }
            postForm.reset();
        });
    }
}

// Function to save and display a post
function saveAndDisplayPost(post) {
    const posts = JSON.parse(localStorage.getItem("userPosts")) || [];
    posts.push(post);
    localStorage.setItem("userPosts", JSON.stringify(posts));

    const storedUser = JSON.parse(localStorage.getItem("digitalFarmingUser"));
    if (storedUser) {
        loadPosts('posts', storedUser.mobile);
    }
    loadPosts('communityPosts');
}