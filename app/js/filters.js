'use strict';

/* Filters */

angular.module('hummedia.filters', [])
.filter('language', function () {
    return function(n){
        var languages = {"ab":"аҧсуа бызшәа","aa":"Afaraf","af":"Afrikaans","ak":"Akan","sq":"gjuha shqipe","am":"አማርኛ","ar":"العربية","an":"aragonés","hy":"Հայերեն","as":"অসমীয়া","av":"авар мацӀ","ae":"avesta","ay":"aymar aru","az":"azərbaycan dili","bm":"bamanankan","ba":"башҡорт теле","eu":"euskara","be":"беларуская мова","bn":"বাংলা","bh":"भोजपुरी","bi":"Bislama","bs":"bosanski jezik","br":"brezhoneg","bg":"български език","my":"ဗမာစာ","ca":"català","ch":"Chamoru","ce":"нохчийн мотт","ny":"chiCheŵa","zh":"中文","cv":"чӑваш чӗлхи","kw":"Kernewek","co":"corsu","cr":"ᓀᐦᐃᔭᐍᐏᐣ","hr":"hrvatski jezik","cs":"čeština","da":"dansk","dv":"ދިވެހި","nl":"Nederlands","dz":"རྫོང་ཁ","en":"English","eo":"Esperanto","et":"eesti","ee":"Eʋegbe","fo":"føroyskt","fj":"vosa Vakaviti","fi":"suomi","fr":"français","ff":"Fulfulde","gl":"galego","ka":"ქართული","de":"Deutsch","el":"ελληνικά","gn":"Avañe'ẽ","gu":"ગુજરાતી","ht":"Kreyòl ayisyen","ha":"Hausa","he":"עברית","hz":"Otjiherero","hi":"हिन्दी","ho":"Hiri Motu","hu":"magyar","ia":"Interlingua","id":"Bahasa Indonesia","ie":"Originally called Occidental; then Interlingue after WWII","ga":"Gaeilge","ig":"Asụsụ Igbo","ik":"Iñupiaq","io":"Ido","is":"Íslenska","it":"italiano","iu":"ᐃᓄᒃᑎᑐᑦ","ja":"日本語 (にほんご)","jv":"basa Jawa","kl":"kalaallisut","kn":"ಕನ್ನಡ","kr":"Kanuri","ks":"कश्मीरी","kk":"қазақ тілі","km":"ខ្មែរ","ki":"Gĩkũyũ","rw":"Ikinyarwanda","ky":"Кыргызча","kv":"коми кыв","kg":"KiKongo","ko":"한국어 (韓國語)","ku":"Kurdî","kj":"Kuanyama","la":"latine","lb":"Lëtzebuergesch","lg":"Luganda","li":"Limburgs","ln":"Lingála","lo":"ພາສາລາວ","lt":"lietuvių kalba","lu":"Tshiluba","lv":"latviešu valoda","gv":"Gaelg","mk":"македонски јазик","mg":"fiteny malagasy","ms":"bahasa Melayu","ml":"മലയാളം","mt":"Malti","mi":"te reo Māori","mr":"मराठी","mh":"Kajin M̧ajeļ","mn":"монгол","na":"Ekakairũ Naoero","nv":"Diné bizaad","nb":"Norsk bokmål","nd":"isiNdebele","ne":"नेपाली","ng":"Owambo","nn":"Norsk nynorsk","no":"Norsk","ii":"ꆈꌠ꒿ Nuosuhxop","nr":"isiNdebele","oc":"occitan","oj":"ᐊᓂᔑᓈᐯᒧᐎᓐ","cu":"ѩзыкъ словѣньскъ","om":"Afaan Oromoo","or":"ଓଡ଼ିଆ","os":"ирон æвзаг","pa":"ਪੰਜਾਬੀ","pi":"पाऴि","fa":"فارسی","pl":"język polski","ps":"پښتو","pt":"português","qu":"Runa Simi","rm":"rumantsch grischun","rn":"Ikirundi","ro":"limba română","ru":"русский язык","sa":"संस्कृतम्","sc":"sardu","sd":"सिन्धी","se":"Davvisámegiella","sm":"gagana fa'a Samoa","sg":"yângâ tî sängö","sr":"српски језик","gd":"Gàidhlig","sn":"chiShona","si":"සිංහල","sk":"slovenčina","sl":"slovenski jezik","so":"Soomaaliga","st":"Sesotho","es":"español","su":"Basa Sunda","sw":"Kiswahili","ss":"SiSwati","sv":"Svenska","ta":"தமிழ்","te":"తెలుగు","tg":"тоҷикӣ","th":"ไทย","ti":"ትግርኛ","bo":"བོད་ཡིག","tk":"Türkmen","tl":"Wikang Tagalog","tn":"Setswana","to":"faka Tonga","tr":"Türkçe","ts":"Xitsonga","tt":"татар теле","tw":"Twi","ty":"Reo Tahiti","ug":"Uyƣurqə","uk":"українська мова","ur":"اردو","uz":"O'zbek","ve":"Tshivenḓa","vi":"Tiếng Việt","vo":"Volapük","wa":"walon","cy":"Cymraeg","wo":"Wollof","fy":"Frysk","xh":"isiXhosa","yi":"ייִדיש","yo":"Yorùbá","za":"Saɯ cueŋƅ","zu":"isiZulu"};
        if(languages[n] === undefined){
            return n;
        }else{
        return languages[n];
        }
    };
})
// translates strings into the user's current locale
.filter('tr', ['language', function (language) {
    return function(n) {
	return language.translate(n);
    }
}]);
