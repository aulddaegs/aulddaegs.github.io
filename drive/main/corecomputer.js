// John Aland, Jr. (Disappointing son of a famous father)
// Insert snippets of John Aland Jr. Musical written by person now disseminating his documents

import * as comlib from "./computer.js";
import { loadtxt } from "./util.js";

class Computer {
    constructor(name, tree){
        this.name = name;
        this.tree = tree;
        this.curr_path = '';
        this.sysenv = {
            'SHOW_HIDDEN_FILES': true,
            'ALLOW_FILE_EDITING': false,
            'SAVE_TO_CURRENT_DIR': false,
            'ALLOW_DEV_CONSOLE': true,
        };
        this.syslog = [];
    }

    resolvePath(path){
        if (path[0] === '/'){
            return comlib.parsePath(this.tree, path);
        }else{
            return comlib.parsePath(this.tree, this.curr_path+'/'+path);
        }
    }

    getFullPath(path){
        if (path[0] !== '/'){
            path = this.curr_path + '/' + path;
        }
        return comlib.regularisePath(path);
    }
}


const CORE_TREE = {
    'my_dear_audience.txt': new comlib.ComputerFile('my_dear_audience.txt', await loadtxt('../textfiles/my_dear_audience.txt'), 'text', 'eidolon'),
    // MENS REA = Guilty Mind
    // Estimativa = Judgement, Imaginativa = Creativity, Memorialis = Memory, Sensus Communis = Common Sense
    // Est = Academic work, Imag = Art/Entertainment, Mem = Records/documents/downloads, Sen = Social engagements/failures
    'mens rea': {
        'downloads': {
            'new.txt': new comlib.ComputerFile('new.txt', 'lolol', 'text', 'jalandjr'),
            'Stop Claude Einstein.sdoc': new comlib.ComputerFile('Stop Claude Einstein.sdoc', '../claude/claude.html', 'web', 'jalandjr'),
            'Zm9zMjAxMmdyYXBo_062012.pdf': new comlib.ComputerFile('Zm9zMjAxMmdyYXBo_062012.pdf', '../pdfs/graph.pdf', 'pdf', 'jalandjr'),
            'gan_explainer.pdf': new comlib.ComputerFile('gan_explainer.pdf', '../pdfs/kanji_explainer.pdf', 'pdf', 'jalandjr'),
            'median_savedarticle(3).sdoc': new comlib.ComputerFile('median_savedarticle(3).sdoc', '../median/acm.html', 'web', 'jalandjr'),
            'fuckyou.jpg': new comlib.ComputerFile('fuckyou.jpg', '../median/amazonmeme.jpg', 'image', 'jalandjr'),
            'fuck.sdoc': new comlib.ComputerFile('fuck.sdoc', '../icpa/icpa.html', 'web', 'jalandjr'),
            'median_savedarticle(2).sdoc': new comlib.ComputerFile('median_savedarticle(2).sdoc', '../median/analysis.html', 'web', 'jalandjr'),
            'median_savedarticle(1).sdoc': new comlib.ComputerFile('median_savedarticle(1).sdoc', '../median/boardgame.html', 'web', 'jalandjr'),

        },
        'estimativa': {
            'legacy': {
                'ontoeconomics_aland.sdoc': new comlib.ComputerFile('ontoeconomics_aland.sdoc', '../ontoeconomics/index.html', 'web', 'jaland'),
                'notes_havlandic_tongue.pdf': new comlib.ComputerFile('notes_havlandic_tongue.pdf', '../pdfs/notes_havlandic_tongue.pdf', 'pdf', 'jaland'),
                'dis_manibus.pdf': new comlib.ComputerFile('dis_manibus.pdf', '../pdfs/dis_manibus.pdf', 'pdf', 'jaland'),
                'jal23_scan_geofaclib1.png': new comlib.ComputerFile('jal23_scan_geofaclib1.png', '../images/poesyannotated.png', 'image', 'jalandjr'),
            },
            'interest': {
                'canticle_scanned(1).png': new comlib.ComputerFile('canticle_scanned(1).png', '../images/canticle_badscan.png', 'image', 'jalandjr'),
                'nohouse_public.mp4': new comlib.ComputerFile('nohouse_public.mp4', '../videos/zhengzi_roughcut.mp4', 'video', 'aexeter'),
                'mefisto_scan.pdf': new comlib.ComputerFile('mefisto_scan.pdf', '../pdfs/mefisto_scan.pdf', 'pdf', 'jalandjr'),
                'TCS_dictionary.pdf': new comlib.ComputerFile('TCS_dictionary.pdf', '../pdfs/TCS.pdf', 'pdf', 'jalandjr'),
                'mulligan_syllogism.sdoc': new comlib.ComputerFile('mulligan_syllogism.sdoc', '../mulligan/display.html', 'web', 'jalandjr'),
            },
            'my work': {
                
            },

        },
        'imaginativa': {
            'rpg': {
                'scandal_full_pages_1_7.pdf': new comlib.ComputerFile('scandal_full_pages_1_7.pdf', '../pdfs/scandal_full_pages.pdf', 'pdf', 'jalandjr'),
                'hacking_playtestv2': {
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

                },
                'svaerdtales.sdoc': new comlib.ComputerFile('svaerdtales.sdoc', '../svaerdtales/index.html', 'web', '4'),
            },
            'fiction': {
                'microblit_threadarchive.sdoc': new comlib.ComputerFile('microblit_threadarchive.sdoc', '../microthread/index.html', 'web', 'jalandjr'),
                'itsabouttime.pdf': new comlib.ComputerFile('itsabouttime.pdf', '../pdfs/fascimile_itsabouttime.pdf', 'pdf', 'jalandjr'),
                'friends.pdf': new comlib.ComputerFile('friends.pdf', '../pdfs/friends.pdf', 'pdf', 'jalandjr'),
            }

        },
        'memorialis': {
            'wodu_rejection_2.png': new comlib.ComputerFile('wodu_rejection_2.png', '../images/email4.png', 'image', 'jalandjr'),
            'walter_rejection.png': new comlib.ComputerFile('walter_rejection.png', '../images/email3.png', 'image', 'jalandjr'),
            'wodu_rejection.png': new comlib.ComputerFile('wodu_rejection.png', '../images/email2.png', 'image', 'jalandjr'),
            'cormorant_rejection.png': new comlib.ComputerFile('cormorant_rejection.png', '../images/email1.png', 'image', 'jalandjr'),
            'aifail.png': new comlib.ComputerFile('aifail.png', '../images/beatai.png', 'image', 'jalandjr'),
            'organicapp.pdf': new comlib.ComputerFile('organicapp.pdf', '../pdfs/organic_goods_application.pdf', 'pdf', 'jalandjr'),
            'delphi_ad.png': new comlib.ComputerFile('delphi_ad.png', '../images/delphi_pool.png', 'image', 'jalandjr'),
            'durne_letter.pdf': new comlib.ComputerFile('durne_letter.pdf', '../pdfs/firing_letter.pdf', 'pdf', 'jalandjr'),
        },
        'sensus communis': {
            'libchat.sdoc': new comlib.ComputerFile('libchat.sdoc', '../libchat/libchat.html', 'web', 'jalandjr'),
            'northseamap.png': new comlib.ComputerFile('northseamap.png', '../images/northseamap.png', 'image', 'jalandjr'),
        },
        '.settings': {
            'fswl.txt': new comlib.ComputerFile('fswl.txt', '#Fileserver whitelist\nnat-1-games\ngothic-games-workshop\nzhengzi-archive\n', 'text', 'jalandjr')
        }
    },
}

const CoreComputer = new Computer('jalandjr_pc', CORE_TREE);

export {CoreComputer};