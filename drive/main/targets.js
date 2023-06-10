import * as comlib from "./computer.js";
import { encodeHTML, loadtxt } from "./util.js";

// Fileserver culture w/ directories

const DummyApple = new comlib.BadEuroPublic('nat-1-games', {
    'redbook_houserules.pdf': new comlib.ComputerFile('redbook_houserules.pdf', '../pdfs/redbook_houserules.pdf', 'pdf', 'kat'),
    'nimpe.pdf': new comlib.ComputerFile('nimpe.pdf', '../pdfs/nimpe.pdf', 'pdf', 'kat'),
    'sekaisen.pdf': new comlib.ComputerFile('sekaisen.pdf', '../pdfs/sekaisen.pdf', 'pdf', 'kami_no_te'),
    'exlibris_reprint.pdf': new comlib.ComputerFile('exlibris_reprint.pdf', '../pdfs/exlibris.pdf', 'pdf', 'kat'),
});

const DummyCorpPub = new comlib.BadEuroPublic('EBM_public', {'guestid.txt': new comlib.ComputerFile('guestid.txt', 'dWlkPTQ=', 'text', 'EBM_corp', {'uid': 4})},);
const DummyCorp = new comlib.BadEuro('EBM_work', {'payload.txt': new comlib.ComputerFile('payload.txt', 'EBM jackpot!', 'text', 'EBM_corp', {'uid': 0})}, false);

const DummyZhengzi = new comlib.BadEuroPublic('zhengzi-archive', {
    'zhengzi_yesteryear.pdf': new comlib.ComputerFile('zhengzi_yesteryear.pdf', '../zhengzi/yesteryear_scanned.pdf', 'pdf', 'aexeter'),
    'zhengzi_movingbodies.pdf': new comlib.ComputerFile('zhengzi_movingbodies.pdf', '../zhengzi/moving_bodies_translated.pdf', 'pdf', 'aexeter'),
    'jiang_subaltern.pdf': new comlib.ComputerFile('jiang_subaltern.pdf', '../zhengzi/article.pdf', 'pdf', 'aexeter'),
    'straka_greatgame.pdf': new comlib.ComputerFile('straka_greatgame.pdf', '../zhengzi/cyoa.pdf', 'pdf', 'aexeter'),
    'missionstatement.pdf': new comlib.ComputerFile('missionstatement.pdf', '../zhengzi/email.pdf', 'pdf', 'aexeter'),
    'fabriard_letter.pdf': new comlib.ComputerFile('fabriard_letter.pdf', '../zhengzi/letter_done.pdf', 'pdf', 'aexeter'),
    'fabriard_loss.pdf': new comlib.ComputerFile('farbiard_loss.pdf', '../zhengzi/loss.pdf', 'pdf', 'aexeter'),
    'hale_zatsuwa.pdf': new comlib.ComputerFile('hale_showa.pdf', '../zhengzi/magazine.pdf', 'pdf', 'aexeter'),
    'zatsuwa_translation.pdf': new comlib.ComputerFile('zatsuwa_translation.pdf', '../zhengzi/text_translation.pdf', 'pdf', 'aexeter'),
    'nohouse_public.mp4': new comlib.ComputerFile('nohouse_public.mp4', '../videos/zhengzi_roughcut.mp4', 'video', 'aexeter'),
});

const DummyNews = new comlib.BadHasher('7-day-newswire', {
    '2604.pdf': new comlib.ComputerFile('2604.pdf', '../news/sevenday_news_2604.pdf', 'pdf', '7day'),
}, '7day'
);

const DummyGothic = new comlib.BadEuro('gothic-games-workshop', {
    'manifest.txt': new comlib.ComputerFile('manifest.txt', await loadtxt('../textfiles/ggw_manifest.txt'), 'text', 'gothic', {'uid': 4}),
    'lotus.pdf': new comlib.ComputerFile('lotus.pdf', '../textfiles/lotus.pdf', 'pdf', 'gothic', {'uid': 1}),
    'redbook.pdf': new comlib.ComputerFile('redbook.pdf', '../pdfs/redbook_clean.pdf', 'pdf', 'gothic', {'uid': 1}),
    'redbook_geo_map.pdf': new comlib.ComputerFile('redbook_geo_map.pdf', '../pdfs/redbook_geo_map.pdf', 'pdf', 'gothic', {'uid': 1}),
    'redbook_pol_map.pdf': new comlib.ComputerFile('redbook_pol_map.pdf', '../pdfs/redbook_pol_map.pdf', 'pdf', 'gothic', {'uid': 1}),
    'redbook_briefings.pdf': new comlib.ComputerFile('redbook_briefings.pdf', '../pdfs/redbook_briefings.pdf', 'pdf', 'gothic', {'uid': 1}),
    'redbook_charsheet.pdf': new comlib.ComputerFile('redbook_charsheeet.pdf', '../pdfs/redbook_charsheet.pdf', 'pdf', 'gothic', {'uid': 1}),
    'svaerdtales_open.sdoc': new comlib.ComputerFile('svaerdtales_open.sdoc', '../svaerdtales/index.html', 'web', 'gothic', {'uid': 1}),
});

const DummyGothicPlaytest = new comlib.BadEuroPublic('gothic-games-workshop-subserialplaytest', {
    'charsheet.pdf': new comlib.ComputerFile('charsheet.pdf', '../hacking/charsheet.pdf', 'pdf', 'gothic'),
    'gmguide_playtest.pdf': new comlib.ComputerFile('gmguide_playtest.pdf', '../hacking/gmguide_playtest.pdf', 'pdf', 'gothic'),
    'scanned_handbook.pdf': new comlib.ComputerFile('scanned_handbook.pdf', '../hacking/scanned_handbook.pdf', 'pdf', 'gothic'),
    'iset.png': new comlib.ComputerFile('iset.png', '../hacking/iset.png', 'image', 'gothic'),
    'label.png': new comlib.ComputerFile('label.png', '../hacking/label.png', 'image', 'gothic'),
    'manhunt.png': new comlib.ComputerFile('manhunt.png', '../hacking/manhunt.png', 'image', 'gothic'),
    'neuralyft.png': new comlib.ComputerFile('neuralyft.png', '../hacking/neuralyft.png', 'image', 'gothic'),
    'system_map.png': new comlib.ComputerFile('system_map.png', '../hacking/system_map.png', 'image', 'gothic'),
    'exploitdb.png': new comlib.ComputerFile('exploitdb.png', '../hacking/exploitdb.png', 'image', 'gothic'),
    'hacking.png': new comlib.ComputerFile('hacking.png', '../hacking/hacking.png', 'image', 'gothic'),
})


// MD5 Hash cracking machine

// Havske Statens Arkiveren machine with 1920s bookbinder

// Progress Quest style game where you can submit character configs

const INTERNET = {
    'nat-1-games': DummyApple,
    'EBM-public': DummyCorpPub,
    'EBM-work': DummyCorp,
    'zhengzi-archive': DummyZhengzi,
    'gothic-games-workshop': DummyGothic,
    'gothic-games-workshop-subserialplaytest': DummyGothicPlaytest,
    '7-day-newswire': DummyNews,
};


export {INTERNET};