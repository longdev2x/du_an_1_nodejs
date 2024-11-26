const mongoose = require('mongoose')
const dotenv = require('dotenv');

dotenv.config();

//kết nối
const connect = async () => {
    try {
        await mongoose
            .connect(process.env.DATABASE_URL, {
                // useNewUrlParser: true,
                // useUnifiedTopology: true, 
            })
            .then(() => {
                console.log("kết nối mongodb thành công");
            })
            .catch((err) => {
                console.log("kết nối thất bại");
            });
    } catch (error) {
        console.log("kết nối thất bại" + error);
    }
};
module.exports = { connect };

