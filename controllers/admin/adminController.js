import Antenna from "../../models/Antenna.js";
import Session from "../../models/Session.js";

const prefixTitle = "Panneau d'administration - ";

// function  getAntennaSlugFromId (_id) {
//     const antenna = Antenna.findOne({ "_id": _id });
//     return antenna.antennaSlug;
// }

// function  getAntennaIdFromSlug (slug) {
//     const antenna = Antenna.findOne({ "antennaSlug": slug });
//     return antenna._id;
// }

/**
 * 
 * login administrator
 * 
**/
export const login = async (req, res, next) => {
    let dashboardHomepageURL = process.env.BASE_URL + "/admin";   
    // si on vient directement sur la page de login (referrer undefined) on renverra sur la homepage du dashboard
    let referer = (typeof req.get('Referrer') == 'undefined') ? dashboardHomepageURL : req.get('Referrer');

    //si on vient du dashboard admin, on envoie bien le referrer, sinon on renvoie l'url /admin (homepage du dashboard)
    let fromURL = referer.includes(dashboardHomepageURL) ? referer : dashboardHomepageURL;   
    
    res.status(403).render("login", {
        title: "Page d'authentification",
        message: "",
        fromURL: fromURL 
    }); 
}
/**
 * 
 * authentification for administrator
 * 
**/
export const auth = (req, res, next) => {
    const username = req.body.user;
    const password = req.body.password;
    const fromURL = req.body.fromURL;

    if (username && password) {
        if (req.session.authenticated) {
            res.json(session);
        } else {
            if (password === process.env.ADMIN_PASSWORD && username === process.env.ADMIN_USERNAME) {
                req.session.authenticated = true;
                req.session.user = { username };
                req.flash('message_success', 'Bienvenue sur le panneau d\'administration Concept Institut.');
                res.redirect(fromURL);
            } else {
                res.status(403).render("login", {
                    title: "Login",
                    message: "Erreur mot de passe.",
                    fromURL: fromURL
                });           
            }
        }
    } else {
        res.status(403).render("login", {
            title: "Login",
            fromURL: fromURL,
            message: "Erreur login ou mot de passe."
        });
    }
}
/**
 * 
 * logout for administrator, go to the homepage of the admin dashboard
 * 
**/
export const logout = (req, res, next) => {
    req.session.destroy((err)=> {
        res.redirect("../");
    });
}

/**
 * 
 * get the list of all antennas in admin dashboard (it's the homepage of the dashboard)
 * TODO proposer un affichage type dashboard avec le nb de centres de formation et de sessions, nb de connexion etc.
 * 
**/
export const dashboard = async (req, res, next) => {
    const antennas = await Antenna.find({});

    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');

    if (0 == antennas) {
        res.status(404).render("admin/dashboard", {
            title: prefixTitle + "Centres de formation",
            antennas: "",
            msg_success,
            msg_error,
            message: "Aucun centre de formation répertorié."
        });
    }
    res.status(200).render("admin/dashboard", {
        title: prefixTitle + "Centres de formation",
        antennas: antennas,
        message_success: req.flash('message_success'),
        message_error: req.flash('message_error'),
        msg_success,
        msg_error,
        message: ""
    });
};

/**
 * 
 * get the list of all antennas in admin dashboard (it's the homepage of the dashboard)
 * 
**/
export const getAntennas = async (req, res, next) => {
    const antennas = await Antenna.find({});

    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');

    if (0 == antennas) {
        res.status(404).render("admin/getAntennas", {
            title: prefixTitle + "Centres de formation",
            antennas: "",
            msg_success,
            msg_error,
            message: "Aucun centre de formation répertorié."
        });
    }
    res.status(200).render("admin/getAntennas", {
        title: prefixTitle + "Centres de formation",
        antennas: antennas,
        message_success: req.flash('message_success'),
        message_error: req.flash('message_error'),
        msg_success,
        msg_error,
        message: ""
    });
};

/**
 * 
 * get a single antenna with his list of sessions in admin dashboard 
 * 
**/
export const getAntenna = async (req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const antennaSlug = req.params.antennaSlug;

    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');

    try{
        const antenna = await Antenna.findOne({ "antennaSlug": antennaSlug });
        const sessions = await Session.find({"sessionAntenna": antenna._id});

        if (0 == antenna) {
            res.status(404).render("admin/getAntenna", {
                title: prefixTitle + "Liste des sessions par centre de formation",
                sessions: "",
                antenna: "",
                message_success: req.flash('message_success'),
                message_error: req.flash('message_error'),
                msg_success,
                msg_error,
                message: "Centre de formation introuvable."
            });
        }
        if ("" == sessions) {
            res.status(200).render("admin/getAntenna", {
                title: prefixTitle + "Liste des sessions " + antenna.antennaName,
                sessions: "",
                antenna: antenna,
                message_success: req.flash('message_success'),
                message_error: req.flash('message_error'),
                msg_success,
                msg_error,
                message: "Aucune session dans ce centre de formation."
            });
        }
        res.status(200).render("admin/getAntenna", {
            title: prefixTitle + "Liste des sessions " + antenna.antennaName,
            antenna: antenna,
            sessions: sessions,
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,
            message: ""
        });
    } catch(error) {
        req.flash('message_error', error);
        res.status(500).render("admin/getAntenna", {
            title: prefixTitle + "Liste des sessions",
            sessions: "",
            antenna: "",
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,
            message: ""
        });
    }
};

/**
 * 
 * render form to create Antenna (requête post) in admin dashboard 
 * 
**/
export const postAntenna = (req, res, next) => {   
    res.status(200).render("admin/createAntenna", {
        title: prefixTitle + "Création de centre de formation ",
        antenna: "",
        message: ""
    });
};

/**
 * 
 * Create Antenna (requête post) in admin dashboard 
 * 
**/
export const ajaxPostAntenna = async (req, res, next) => {
    // envoyer le nom du centre de formation via req.body
    const antennaName = req.body.antennaName;
    const antennaDescription = req.body.antennaDescription;
    const antennaSlug = req.body.antennaSlug;
    const antennaImg = req.body.antennaImg ? req.body.antennaImg : false;

    try{
        // on créé un nouveau centre de formation avec mongoose (Antenna est un objet Schema de mongoose déclaré dans le model)
        const antenna = await Antenna.create({
            // antennaName: antennaName,
            antennaName, // si la clé = valeur, on ne répète pas
            antennaDescription,
            antennaSlug,
            antennaImg
        });
        req.flash('message_success', "Centre de formation " + antenna.antennaName + " créé");
        res.status(201).redirect("/admin/antenna/" + antenna.antennaSlug);
    } catch(error) {
        if (error.errors){
            req.flash('message_error', "ERREUR " + error);
            res.status(500).redirect("/admin/create-session/"); 
            return;           
        }
        req.flash('message_error', "ERREUR " + error);
        //! attention, avec le render, si on actualise ça relance la requête de création : j'utilise le redirect avec connect-flash
        res.status(500).redirect("/admin/antennas");
        // res.status(500).render("admin/getAntenna", {
        //     title: prefixTitle + "Création d'un centre de formation",
        //     sessions: "",
        //     antenna: "",
        //     flashMessage:"",
        //     message: error
        // });
    }
};

/**
 * 
 * delete a single antenna in admin dashboard 
 * 
**/
// TODO supprimer plusieurs centres de formation en 1 seule fois avec des checkbox
export const deleteAntenna = async (req, res, next) => {
    const antennaSlug = req.params.antennaSlug;
 
    try{
        const antenna = await Antenna.findOne({ "antennaSlug": antennaSlug });
        const antennaName = antenna.antennaName;

        if (0 == antenna) {
            req.flash('message_error', "erreur, centre de formation introuvable.");
            res.status(404).redirect("/admin/antennas");
        }
        if (0 != antenna.antennaNbSessions) {
            req.flash('message_error', "Impossible de supprimer ce centre de formation car il contient des sessions."),
            res.status(400).redirect("/admin/antenna/" + antenna.antennaSlug);
        } else {
            const result = await Antenna.findByIdAndDelete({ "_id": antenna._id  });
            req.flash('message_success', "Centre de formation " + antennaName + " supprimé");
            res.status(200).redirect("/admin/antennas");
        }
      } catch(error) {
        req.flash('message_error', error);
        res.status(500).redirect("/admin/antennas");
    }
};

/**
 * 
 * get the list of all sessions in admin dashboard 
 * 
**/
export const getSessions = async (req, res, next) => {
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');
    try{
        const sessions = await Session.find({}).populate("sessionAntenna");

        if (0 == sessions.length) {
            res.status(404).render("admin/getSessions", {
                title: prefixTitle + "Liste des sessions",
                sessions: "",
                message_success: req.flash('message_success'),
                message_error: req.flash('message_error'),
                msg_success,
                msg_error,
                message: "Aucune session trouvée."
            });
        }
        res.status(200).render("admin/getSessions", {
            title: prefixTitle + "Liste des sessions",
            sessions: sessions,
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,
            message: "",
        });
    } catch(error) {
        res.status(500).render("admin/getSessions", {
            title: prefixTitle + "Liste des sessions",
            sessions: "",
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,
            message: error
        });
    }
};

/**
 * 
 * get a single Session in admin dashboard 
 * 
**/
export const getSession = async (req, res, next) => {
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');


    const id = req.params.sessionId;
    try{ //je récupère les infos du centre de formation par .populate
        const session = await Session.findOne({ "_id": id }).populate("sessionAntenna");
        if (null == session) {
            res.status(404).render("admin/getSession", {
                title: "Erreur Fiche session",
                session: "",
                message_success: req.flash('message_success'),
                message_error: req.flash('message_error'),
                msg_success,
                msg_error,                
                message: "Erreur : session introuvable."
            });
        }
        res.status(200).render("admin/getSession", {
            title: "Fiche Session " + session.sessionName,
            session: session,
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,
            message: ""
        });
    } catch {
        res.status(404).render("admin/getSession", {
            title: "Erreur Fiche session",
            session: "",
            message_success: req.flash('message_success'),
            message_error: req.flash('message_error'),
            msg_success,
            msg_error,
            message: "Erreur serveur."
        });
    }
};
    
/**
 * 
 * delete a single antenna in admin dashboard 
 * 
**/
// TODO supprimer plusieurs sessions en 1 seule fois avec des checkbox
export const deleteSession = async (req, res, next) => {
    const sessionId = req.params.sessionId;
    const antennaSlug = req.params.antennaSlug;

    try{
        const session = await Session.findByIdAndDelete({ "_id": sessionId });
        if (null != session) {
            const antenna = await Antenna.findByIdAndUpdate(
                { "_id": session.sessionAntenna }, 
                { $inc: { antennaNbSessions: -1 } }, 
                { new: true }
                //  (err, doc)
            );

            req.flash('message_success', "La session " + session.sessionName + " supprimée.");
            if (antennaSlug) {
                res.status(200).redirect("/admin/antenna/" + antennaSlug);
            } else {
                res.status(200).redirect("/admin/sessions/");
            }
        } else {
            req.flash('message_error', "ERREUR session introuvable.");
            if (antennaSlug) {
                res.status(500).redirect("/admin/antenna/" + antennaSlug);
            } else {
                res.status(500).redirect("/admin/sessions/");
            }
        }
      } catch(error) {
        req.flash('message_error', "ERREUR " + error);
        if (antennaSlug) {
            res.status(500).redirect("/admin/antenna/" + antennaSlug);
        } else {
            res.status(500).redirect("/admin/sessions/");
        }
    }
};

/**
 * 
 * render form to create Session (requête post) in admin dashboard 
 * 
**/
export const postSession = async(req, res, next) => {
    const antennaSlug = req.params.antennaSlug;
    let antennaSelected = null;
    let msg_success = req.flash('message_success');
    let msg_error = req.flash('message_error');
    if (antennaSlug != null) {
        antennaSelected = await Antenna.findOne({ "antennaSlug": antennaSlug });
        if (antennaSelected) antennaSelected = antennaSelected._id.toString()
    } 
    const antennas = await Antenna.find({});

    if (0 == antennas) {
        res.status(404).render("admin/createSession", {
            title: prefixTitle + " Création de session",
            antennas: "",
            antennaSelected: antennaSelected,
            message: "Aucun centre de formation répertorié, vous devez créer un centre de formation avant de pouvoir ajouter une session."
        });
    }
    res.status(200).render("admin/createSession", {
        title: prefixTitle + " Création de session",
        antennas: antennas,
        antennaSelected: antennaSelected,
        message_success: req.flash('message_success'),
        message_error: req.flash('message_error'),
        msg_success,
        msg_error,    
        message: ""
    });
};

/**
 * 
 * Create Session (requête post) in admin dashboard 
 * 
**/
export const ajaxPostSession = async (req, res, next) => {
    // envoyer le nom du centre de formation via req.body
    const sessionName = req.body.sessionName;
    const sessionDescription = req.body.sessionDescription;
    const sessionPrice = req.body.sessionPrice;
    const sessionAntennaId = req.body.sessionAntennaId;
    
    try{
        // on créé une nouvelle session avec mongoose (Session est un objet Schema de mongoose déclaré dans le model)
        const session = await Session.create({
            sessionName, // si la clé = valeur, on ne répète pas
            sessionDescription,
            sessionPrice, 
            sessionAntenna: sessionAntennaId
        });

        //const antenna = await Antenna.findOne({ "_id": sessionAntennaId });
        const antenna = await Antenna.findByIdAndUpdate(
            { "_id": sessionAntennaId }, 
            { $inc: { antennaNbSessions: 1 } }, 
            { new: true }
            //  (err, doc)
        );
        req.flash('message_success', "Session " + session.sessionName + " créée");
        res.status(201).redirect("/admin/antenna/" + antenna.antennaSlug);
    } catch(error) {
        if (error.errors){
            req.flash('message_error', "ERREUR " + error);
            res.status(500).redirect("/admin/create-session/"); 
            return;           
        }
        req.flash('message_error', "ERREUR " + error);
        res.status(500).redirect("/admin/sessions/");
    }
};

/**
 * 
 * render form to update Session (requête patch) in admin dashboard 
 * 
**/
export const updateSession = async(req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const id = req.params.sessionId;
    try{ 
    
        const session = await Session.findOne({ "_id": id }).populate("sessionAntenna");

        const antennaSlug = session.sessionAntenna.antennaSlug;
        let antennaSelected = session.sessionAntenna._id.toString();

        // if (antennaSlug != null) {
        //     antennaSelected = await Antenna.findOne({ "antennaSlug": antennaSlug });
        //     if (antennaSelected) antennaSelected = antennaSelected._id.toString()
        // }     

        const antennas = await Antenna.find({});

        if (null == session) {
            res.status(404).render("admin/getSessions", {
                title: "Erreur modification session",
                session: "",
                antennas: "",
                antennaSelected: antennaSelected,
                message: "Erreur : session introuvable."
            });
        }
        if (0 == antennas) {
            res.status(404).render("admin/updateSession", {
                title: prefixTitle + " Modifier un session",
                antennas: "",
                antennaSelected: antennaSelected,
                message: "Erreur : Aucun centre de formation répertorié."
            });
        }
        res.status(200).render("admin/updateSession", {
            title: "Modifier la session " + session.sessionName,
            antennas: antennas,
            antennaSelected: antennaSelected,
            session: session,
            message: ""
        });
    } catch {
        res.status(404).render("admin/getSessions", {
            title: "Erreur modification session",
            antennas: "",
            antennaSelected: antennaSelected,
            session: "",
            message: "Erreur serveur."
        });
    }
};

/**
 * 
 * Update Session (requête patch) in admin dashboard 
 * 
**/
export const ajaxUpdateSession = async (req, res, next) => {
     //on récupère l'identifiant donné dans la route paramétrique et le nouveau nom passé dans le corps de la requête
     const id = req.params.sessionId;
     const sessionName = req.body.sessionName;
     const sessionDescription = req.body.sessionDescription;
     const sessionPrice = req.body.sessionPrice;
     const sessionAntennaId = req.body.sessionAntennaId;
    try{
        const result = await Session.findByIdAndUpdate(
        { "_id": id }, 
        { 
            sessionName,
            sessionPrice: sessionPrice,
            sessionDescription : sessionDescription,
            sessionAntennaId: sessionAntennaId,
        }, 
        { new: true }
        //  (err, doc)
        );
        if (null == result) {
            res.status(404).json({ "ErrorMessage": "Erreur : mise à jour impossible, session non trouvée" });
        }
        req.flash('message_success', "Session " + result.sessionName + " modifiée");
        res.status(200).redirect("/admin/session/" + id);
    } catch(error) {
        if (error.errors){
            req.flash('message_error', "ERREUR " + error);
            res.status(500).redirect("/admin/create-session/"); 
            return;           
        }
        req.flash('message_error', "ERREUR " + error);
        res.status(500).redirect("/admin/sessions/");
    }
};

/**
 * 
 * render form to update Session (requête patch) in admin dashboard 
 * 
**/
export const updateAntenna = async(req, res, next) => {
    //on récupère l'identifiant donné dans la route paramétrique
    const antennaSlug = req.params.antennaSlug;
    try{ 
    
        const antenna = await Antenna.findOne({ "antennaSlug": antennaSlug });
        // pour éventuellement mettre à jour le compteur de sessions du centre de formation avec le nombre réel de sessions enregistrées dans la base
        const count =  await Session.countDocuments({sessionAntenna: antenna._id});

        if (null == antenna) {
            res.status(404).render("admin/getAntennas", {
                title: "Erreur modification centre de formation",
                antenna: "",
                message: "Erreur : Centre de formation introuvable."
            });
        }
        res.status(200).render("admin/updateAntenna", {
            title: "Modifier le centre de formation " + antenna.antennaName,
            antenna: antenna,
            nbSessionsInBDD: count,
            message: ""
        });
    } catch {
        res.status(404).render("admin/getAntennas", {
            title: "Erreur modification centre de formation",
            antenna: "",
            message: "Erreur serveur."
        });
    }
};

/**
 * 
 * Update Session (requête patch) in admin dashboard 
 * 
**/
export const ajaxUpdateAntenna = async (req, res, next) => {
     //on récupère l'identifiant donné dans la route paramétrique et le nouveau nom passé dans le corps de la requête
     const id = req.body.id;
     const antennaSlug = req.body.antennaSlug;
     const antennaName = req.body.antennaName;
     const antennaDescription = req.body.antennaDescription;
     const antennaImg = req.body.antennaImg;
     const antennaNbSessions = req.body.antennaNbSessions;
    try{
        const result = await Antenna.findByIdAndUpdate(
        { "_id": id }, 
        { 
            antennaName,
            antennaSlug :antennaSlug,
            antennaDescription : antennaDescription,
            antennaImg: antennaImg,
            antennaNbSessions: antennaNbSessions,
        }, 
        { new: true }
        //  (err, doc)
        );
        if (null == result) {
            res.status(404).json({ "ErrorMessage": "Erreur : mise à jour impossible, centre de formation non trouvé" });
        }
        req.flash('message_success', "Centre de formation " + result.antennaName + " modifié");
        res.status(200).redirect("/admin/antenna/" + antennaSlug);
    } catch(error) {
        if (error.errors){
            req.flash('message_error', "ERREUR " + error);
            res.status(500).redirect("/admin/create-session/"); 
            return;           
        }        
        req.flash('message_error', "ERREUR " + error);
        res.status(500).redirect("/admin/antennas/");
    }
};

/**
 * 
 * Update number of Session in a antenna in admin dashboard 
 * 
**/
export const ajaxUpdateNbSessionsInAntenna = async (req, res, next) => {
    const id = req.params.antennaId;
    const antennaNbSessions =  await Session.countDocuments({sessionAntenna: id});
    
   try{
       const result = await Antenna.findByIdAndUpdate(
       { "_id": id }, 
       { 
           antennaNbSessions: antennaNbSessions,
       }, 
       { new: true }
       //  (err, doc)
       );
       if (null == result) {
           res.status(404).json({ "ErrorMessage": "Erreur : mise à jour impossible, centre de formation non trouvé" });
       }
       req.flash('message_success', "le compteur de sessions du centre de formation " + result.antennaName + " a été rafraîchi ");
       res.status(200).redirect(req.get('Referrer'));
   } catch(err) {
       req.flash('message_error', "ERREUR " + err);
       res.status(500).redirect(req.get('Referrer'));
   }
};