// Importation de Cloudinary
const cloudinary = require("cloudinary");
// Configuration de Cloudinary
cloudinary.config({
	cloud_name: "devtadpg5",
	api_key: "926556466949595",
	api_secret: "x0sz0n857RPoRurBP6UTFpS3ob8"
});
const uid2 = require("uid2");

const uploadPictures = (req, res, next) => {
	// J'initialise un tableau vide pour y stocker mes images uploadées
	const pictures = [];
	// Je récupères le tabelau de fichiers
	const files = req.body.companyLogo;
	// J'initialise le nombre d'upload à zéro
	let filesUploaded = 0;
	// Et pour chaque fichier dans le tableau, je crée un upload vers Cloudinary
	if (files && files.length) {
		files.forEach(file => {
			// Je crée un nom spécifique pour le fichier
			const name = uid2(16);
			cloudinary.v2.uploader.upload(
				file,
				{
					// J'assigne un dossier spécifique dans Cloudinary pour chaque utilisateur
					public_id: `test-it/${req.body.companyName}/${name}`
				},
				(error, result) => {
					// console.log(error, result);
					// Si j'ai une erreur avec l'upload, je sors de ma route
					if (error) {
						return res.status(500).json({ error });
					}
					// console.log("upload pictures", result);
					// Sinon, je push mon image dans le tableau
					let urlWithSizing =
						"https://res.cloudinary.com/devtadpg5/image/upload/w_600,h_400/" +
						result.public_id +
						"." +
						result.format;
					pictures.push(urlWithSizing);
					// Et j'incrémente le nombre d'upload
					filesUploaded++;
					// console.log("-------\n", result);
					// Si le nombre d'uploads est égal au nombre de fichiers envoyés...
					if (filesUploaded === files.length) {
						/* res
                        .status(200)
                        .json({message: `You've uploaded ${filesUploaded} files.`}); */
						// ... je stocke les images dans l'objet `req`...
						req.pictures = pictures;
						// ... et je poursuis ma route avec `next()`
						next();
					}
				}
			);
		});
	} else {
		// Pas de fichier à uploader ? Je poursuis ma route avec `next()`.
		next();
	}
};

module.exports = uploadPictures;
