requirejs.config({
  // Paths are aliases to other modules
  paths: {
    // Core
    "popcorn.core": "../../popcorn-js/popcorn",
    "popcorn.ie8": "../../popcorn-js/ie8/popcorn.ie8",

    // Wrappers
//    "popcorn._MediaElementProto": "../../popcorn-js/wrappers/common/popcorn._MediaElementProto",
//    "popcorn.HTMLMediaElement": "../../popcorn-js/wrappers/html5/popcorn.HTMLMediaElement",
//    "popcorn.HTMLNullVideoElement": "../../popcorn-js/wrappers/null/popcorn.HTMLNullVideoElement",
//    "popcorn.HTMLSoundCloudAudioElement": "../../popcorn-js/wrappers/soundcloud/popcorn.HTMLSoundCloudAudioElement",
//    "popcorn.HTMLVimeoVideoElement": "../../popcorn-js/wrappers/vimeo/popcorn.HTMLVimeoVideoElement",
//    "popcorn.HTMLYouTubeVideoElement": "../../popcorn-js/wrappers/youtube/popcorn.HTMLYouTubeVideoElement",

    // Players
    "popcorn.player": "../../popcorn-js/modules/player/popcorn.player",
    "popcorn.youtube": "../../popcorn-js/players/youtube/popcorn.youtube",
    "popcorn.vimeo": "../../popcorn-js/players/vimeo/popcorn.vimeo",
    "popcorn.soundcloud": "../../popcorn-js/players/soundcloud/popcorn.soundcloud",

    // Plugins
//    "popcorn.googlemap": "../templates/assets/plugins/googlemap/popcorn.googlemap",
//    "popcorn.image": "../templates/assets/plugins/image/popcorn.image",
//    "popcorn.loopPlugin": "../templates/assets/plugins/loopPlugin/popcorn.loopPlugin",
//    "popcorn.pausePlugin": "../templates/assets/plugins/pausePlugin/popcorn.pausePlugin",
//    "popcorn.popup": "../templates/assets/plugins/popup/popcorn.popup",
//    "popcorn.sequencer": "../templates/assets/plugins/sequencer/popcorn.sequencer",
//    "popcorn.skip": "../templates/assets/plugins/skip/popcorn.skip",
//    "popcorn.text": "../templates/assets/plugins/text/popcorn.text",
//    "popcorn.twitter": "../templates/assets/plugins/twitter/popcorn.twitter",
//    "popcorn.wikipedia": "../templates/assets/plugins/wikipedia/popcorn.wikipedia",
//    
//    // Custom Hummedia plugins
//    "popcorn.reference": "../templates/assets/hummedia-plugins/reference/popcorn.reference",
//    "popcorn.modal": "../templates/assets/hummedia-plugins/modal/popcorn.modal",

    // RequireJS
    "text": "../external/require/text"
  },
  // shim config defines dependencies between non-AMD modules, which is all of the Popcorn code
  shim: {
    // Core
    "popcorn.core": [ "popcorn.ie8" ],

    // Wrappers
//    "popcorn._MediaElementProto": [ "popcorn.core" ],
//    "popcorn.HTMLMediaElement": [ "popcorn.core" ],
//    "popcorn.HTMLNullVideoElement": [ "popcorn.core", "popcorn._MediaElementProto" ],
//    "popcorn.HTMLSoundCloudAudioElement": [ "popcorn.core", "popcorn._MediaElementProto" ],
//    "popcorn.HTMLVimeoVideoElement": [ "popcorn.core", "popcorn._MediaElementProto" ],
//    "popcorn.HTMLYouTubeVideoElement": [ "popcorn.core", "popcorn._MediaElementProto" ],

    // Players
    "popcorn.player": [ "popcorn.core" ],
    "popcorn.soundcloud": [ "popcorn.core", "popcorn.player", "popcorn.HTMLSoundCloudAudioElement" ],
    "popcorn.vimeo":  [ "popcorn.core", "popcorn.player", "popcorn.HTMLVimeoVideoElement" ],
    "popcorn.youtube":  [ "popcorn.core", "popcorn.player", "popcorn.HTMLYouTubeVideoElement" ],

    // Plugins
//    "popcorn.googlemap": [ "popcorn.core" ],
//    "popcorn.image": [ "popcorn.core" ],
//    "popcorn.loopPlugin": [ "popcorn.core" ],
//    "popcorn.pausePlugin": [ "popcorn.core" ],
//    "popcorn.popup": [ "popcorn.core"],
//    "popcorn.sequencer": [ "popcorn.core", "popcorn.player" ],
//    "popcorn.skip": [ "popcorn.core" ],
//    "popcorn.text": [ "popcorn.core" ],
//    "popcorn.twitter": [ "popcorn.core" ],
//    "popcorn.wikipedia": [ "popcorn.core" ],
//    "popcorn.modal": [ "popcorn.core" ],
//    "popcorn.reference": [ "popcorn.core" ]
  }
});

define([
  // We must list all of the popcorn files that get used
  // shim config will handle dependency order
//  "popcorn.soundcloud",
//  "popcorn.vimeo",
//  "popcorn.youtube",
//  "popcorn.googlemap",
//  "popcorn.image",
//  "popcorn.loopPlugin",
//  "popcorn.pausePlugin",
//  "popcorn.popup",
//  "popcorn.sequencer",
//  "popcorn.skip",
//  "popcorn.text",
//  "popcorn.twitter",
//  "popcorn.wikipedia",
//  "popcorn.HTMLMediaElement",
//  "popcorn.HTMLNullVideoElement",
//  "popcorn.HTMLSoundCloudAudioElement",
//  "popcorn.HTMLVimeoVideoElement",
//  "popcorn.HTMLYouTubeVideoElement",
//  "popcorn.modal",
//  "popcorn.reference"
], function() {
  return {};
});
