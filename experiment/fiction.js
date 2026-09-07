// ============================================================

// ── Utilities ────────────────────────────────────────────────
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

// ── Condition assignment ─────────────────────────────────────

// Filters erotic stimuli based on participant gender/sexuality demographics.
// Returns only the subcategories appropriate for this participant.
function assignCondition_erotic(erotic_stimuli) {
    let demographic_data = jsPsych.data
        .get()
        .filter({ screen: "demographic_questions" })
        .values()[0]
    let gender    = demographic_data.response.Gender
    let sexuality = demographic_data.response.SexualOrientation
    let choice    = demographic_data.response.StimuliChoice

    let stimuliCategory = []
    if (choice) {
        if (choice === "Women (and heterosexual couples)") {
            stimuliCategory = ["Female", "Opposite-sex Couple"]
        } else if (choice === "Men (and heterosexual couples)") {
            stimuliCategory = ["Male", "Opposite-sex Couple"]
        } else if (choice === "Only women (and lesbian couples)") {
            stimuliCategory = ["Female", "Female Couple"]
        } else if (choice === "Only men (and gay couples)") {
            stimuliCategory = ["Male", "Male Couple"]
        }
    } else if (sexuality === "Heterosexual") {
        if (gender === "Male") {
            stimuliCategory = ["Female", "Opposite-sex Couple"]
        } else if (gender === "Female") {
            stimuliCategory = ["Male", "Opposite-sex Couple"]
        }
    } else if (sexuality === "Homosexual") {
        if (gender === "Male") {
            stimuliCategory = ["Male", "Male Couple"]
        } else if (gender === "Female") {
            stimuliCategory = ["Female", "Female Couple"]
        }
    } else {
        console.error("Unexpected demographic data.")
        return []
    }

    return erotic_stimuli.filter(s => stimuliCategory.includes(s.SubCategory))
}

// Assigns AI/Photo conditions and labels to all stimuli.
function assignCondition_label(stimuli_list) {
    let shuffled = shuffleArray([...stimuli_list])

    let label_pool = []
    while (label_pool.length < shuffled.length) {
        label_pool = label_pool.concat(shuffleArray([...ai_label_names]))
    }

    for (let i = 0; i < shuffled.length; i++) {
        if (i < Math.ceil(shuffled.length / 2)) {
            shuffled[i].Condition = "AI"
            shuffled[i].Label     = label_pool[i]
        } else {
            shuffled[i].Condition = "Photo"
            shuffled[i].Label = shuffled[i].Category === "Art"
                ? artist_names[Math.floor(Math.random() * artist_names.length)]
                : photograph[Math.floor(Math.random() * photograph.length)]
        }
    }
    return shuffleArray(shuffled)
}

var ai_label_names = ["chatgpt", "nanobanana", "midjourney", "recraft", "gemini"]

var photograph = [
    "Hartley & Sons Photography",
    "Atlas Photo Agency",
    "Whitmore Portrait Co.",
    "Chronicle Photography",
    "Pemberton Photography",
    "Lumière Image Agency",
]

var artist_names = [
    "E. Voss",
    "M. Calloway",
    "Isabelle Renard",
    "T. Ashworth",
    "Lena Brandt",
    "J. Okafor",
    "Simone Delvaux",
    "R. Nakamura",
]

// ── Global counters ──────────────────────────────────────────
var fiction_trialnumber = 1

// ── Helper: build image HTML with badge overlay ───────────────
// Returns a full HTML string: the image with a label badge in
// the bottom-right corner, as if it is a watermark / source tag.
// NOTE: this function is not used in the active trial timeline
// (fiction_ratings handles its own badge inline).
function buildImageWithBadge(imagePath, condition, label, category) {
    // Outer wrapper – centres the whole block on screen
    let html = "<div style='" +
        "display:flex; justify-content:center; align-items:center;" +
        "width:100vw; height:100vh; margin:0; padding:0;" +
        "'>" +
        "<div style='position:relative; display:inline-block;'>"

    // The stimulus image
    html += "<img src='" + imagePath + "' style='" +
        "max-height:90vh; max-width:90vw;" +
        "object-fit:contain; display:block;'" +
        "/>"

    // Badge – bottom-right corner
    var badge_html = ""
    if (category !== "Chat") {
        if (condition === "AI") {
            badge_html =
                "<div style='" +
                "position:absolute; bottom:12px; right:12px;" +
                "background:rgba(176, 174, 174, 0.72);" +
                "border-radius:10px; padding:6px 10px;" +
                "display:flex; align-items:center; gap:6px;" +
                "'>" +
                "<img src='labels/" + label + ".png' style='" +
                "max-height:36px; max-width:110px; " +
                "object-fit:contain; vertical-align:middle;" +
                "'/>" +
                "</div>"
        } else {
            var badge_icon = category === "Art" ? "🎨 " : "📷 "
            badge_html =
                "<div style='" +
                "position:absolute; bottom:12px; right:12px;" +
                "background:rgb(255, 255, 255);" +
                "border-radius:10px; padding:6px 14px;" +
                "font-size:17px; font-weight:bold; color:#222;" +
                "font-family:sans-serif;" +
                "'>" +
                badge_icon + label + "</div>"
        }
    }

    html += badge_html + "</div></div>"
    return html
}

// ── Instructions ─────────────────────────────────────────────
var fiction_instructions = {
    type: jsPsychHtmlButtonResponse,
    css_classes: ["narrow-text"],
    stimulus:
        "<h2>Task</h2>" +
        "<p>This study is conducted by researchers from the <b>University of Sussex</b>.</p>" +
        "<p>You will see a series of images drawn from four categories: <b>faces</b>, <b>artworks</b>, <b>chat screenshots</b>, and <b>erotic photographs</b>. " +
        "<p>The images will be <b>briefly shown on screen</b>. After each one, we will ask you to rate it on a dimension.</p>" +
        "<p><b>Pay attention to each category as they each have their own rating.</b></p>" +
        "<p><b>Please respond based on your first impression.</b></p>" +
        "<p style='text-align:center'>Press <i>Start</i> when you are ready.</p>",
    choices: ["Start"],
    data: { screen: "fiction_instructions1" },
}

// ── Preload ──────────────────────────────────────────────────
var fiction_preloadstims = {
    type: jsPsychPreload,
    message: "Please wait while the experiment is loading…",
    images: stimuli_list.map((a) => "stimuli/" + a.stimulus).concat(
        ai_label_names.map((n) => "labels/" + n + ".png")
    ),
    on_load: function () {
        // 1. Separate erotic and non-erotic stimuli
        let erotic_stimuli     = stimuli_list.filter(s => s.Category === "Erotic")
        let non_erotic_stimuli = stimuli_list.filter(s => s.Category !== "Erotic")

        // 2. Filter erotic based on participant demographics
        let filtered_erotic = assignCondition_erotic(erotic_stimuli)

        // 3. Combine and assign AI/Photo labels to everything
        stimuli = assignCondition_label([...non_erotic_stimuli, ...filtered_erotic])
    },
}

// ── Phase 1 trials ───────────────────────────────────────────

var fiction_fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "<div style='font-size:500%; position:fixed; text-align:center; top:50%; bottom:50%; right:20%; left:20%'>+</div>",
    choices: ["s"],
    trial_duration: 500,
    save_trial_parameters: { trial_duration: true },
    data: function () {
        return {
            screen: "fiction_fixation1",
            item: jsPsych.evaluateTimelineVariable("stimulus"),
        }
    },
}

// Category-specific question definitions
// Each entry is a complete SurveyJS element object — used directly in the survey.
var category_questions = {
    "Face": {
        type: "rating",
        name: "Attractiveness",
        title: "How attractive did you find this person?",
        isRequired: true,
        rateMin: 0,
        rateMax: 6,
        minRateDescription: "Very unattractive",
        maxRateDescription: "Very attractive",
        displayMode: "buttons",
    },
    "Erotic": {
        type: "rating",
        name: "Body_Reaction",
        title: "How much did you feel your body react when looking at this image?",
        isRequired: true,
        rateMin: 0,
        rateMax: 6,
        minRateDescription: "Not at all",
        maxRateDescription: "Strong reaction",
        displayMode: "buttons",
    },
    "Art": {
        type: "rating",
        name: "Meaning",
        title: "This artwork expresses something meaningful and deep...",
        isRequired: true,
        rateMin: 0,
        rateMax: 6,
        minRateDescription: "Not at all",
        maxRateDescription: "Very much",
        displayMode: "buttons",
    },
    "Chat": {
        type: "rating",
        name: "PartnerTrust",
        title: "I can trust the interaction partner.",
        isRequired: true,
        rateMin: 1,
        rateMax: 7,
        rateCount: 7,
        minRateDescription: "Not at all",
        maxRateDescription: "Completely",
        displayMode: "buttons",
    },
}

var fiction_ratings = {
    type: jsPsychSurvey,
    survey_json: function () {
        var stimulus  = jsPsych.evaluateTimelineVariable("stimulus")
        var condition = jsPsych.evaluateTimelineVariable("Condition")
        var label     = jsPsych.evaluateTimelineVariable("Label")
        var category  = jsPsych.evaluateTimelineVariable("Category")
        var cat_q     = category_questions[category]

        // Rebuild the badge so the image is visible while the participant rates
        var badge_html
        if (condition === "AI") {
            badge_html =
                "<div style='position:absolute; bottom:8px; right:8px;" +
                "background:rgba(176, 174, 174, 0.72); border-radius:8px; padding:4px 8px;" +
                "display:flex; align-items:center;'>" +
                "<img src='labels/" + label + ".png' style='" +
                "max-height:28px; max-width:90px; object-fit:contain;'/>" +
                "</div>"
        } else {
            var badge_icon = category === "Art" ? "🎨 " : "📷 "
            badge_html =
                "<div style='position:absolute; bottom:8px; right:8px;" +
                "background:rgba(176, 174, 174, 0.72); border-radius:8px; padding:4px 10px;" +
                "font-size:14px; font-weight:bold; color:#222; font-family:sans-serif;'>" +
                badge_icon + label + "</div>"
        }
        if (category === "Chat") { badge_html = "" }

        // Chat images are scrollable so participants can read the full conversation.
        // All other categories show a constrained image with a badge overlay.
        var image_html
        if (category === "Chat") {
            image_html =
                "<div style='max-height:65vh; overflow-y:auto; margin-bottom:12px; border:1px solid #ddd;'>" +
                "<img src='stimuli/" + stimulus + "' style='max-width:80vw; display:block; margin:0 auto;'/>" +
                "</div>"
        } else {
            image_html =
                "<div style='text-align:center; margin-bottom:12px;'>" +
                "<div style='position:relative; display:inline-block;'>" +
                "<img src='stimuli/" + stimulus + "' style='" +
                "max-height:50vh; max-width:80vw; object-fit:contain; display:block;'/>" +
                badge_html +
                "</div></div>"
        }

        return {
            goNextPageAutomatic: true,
            showQuestionNumbers: false,
            showNavigationButtons: false,
            title: "",
            pages: [
                {
                    elements: [
                        // Image with badge shown above the rating
                        { type: "html", name: "image_display", html: image_html },
                        // Single category-specific rating below
                        cat_q,
                    ],
                },
            ],
        }
    },
    data: { screen: "fiction_ratings1" },
    on_finish: function () {
        fiction_trialnumber += 1
    },
}

// ── Break ────────────────────────────────────────────────────
var fiction_break = {
    type: jsPsychHtmlButtonResponse,
    css_classes: ["narrow-text"],
    stimulus:
        "<h1>Break time</h1>" +
        "<p>We know these types of experiment can feel repetitive. " +
        "Please take this opportunity to <b>rest your eyes and relax</b>.</p>",
    choices: ["Ready to continue!"],
    data: { screen: "fiction_phase1_break" },
}