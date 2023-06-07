const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const abc = require('./contactmodel');
const imgsd = require('./newpost');
const nopostdp = require('./nopostdp');
const messagemodel = require('./message');
const storycreate = require('./stories');
const app = express();
const dotenv = require('dotenv')
dotenv.config();
const multer = require('multer');
const { resolve } = require('path');
const upload = multer({ dest: 'uploads/' })
app.use('/uploads', express.static('uploads'))
app.use(cors());
app.use(express.json());
mongoose.set('strictQuery', false);




const url = `${process.env.MONGO}`


mongoose.connect(url)









app.post('/reg', async(req, res) => {


    const resn = await abc.findOne({ username: req.body.username })
    if (resn !== null) {

        res.json("alreadyexist")


    } else {
        const data = await abc.create({
            username: req.body.username,
            password: req.body.password,

        })


        res.json("done")
    }


})



app.post('/sersign', async(req, res) => {

        let usn = req.body.username;
        let pass = req.body.password;

        const check = await abc.findOne({ username: usn, password: pass })

        if (check !== null) {

            return res.json(check)
        } else {

            return res.json("firstregister")
        }

    }

)












//creating posts

app.post('/createpost', upload.single('image'), async(req, res) => {



        const imageUrl = req.file.path



        const c = await imgsd.findOne({ username: req.body.usn })


        if (c) {

            const data = await imgsd.create({
                username: req.body.usn,
                imageUrl: imageUrl,
                about: req.body.about,
                dp: c.dp,

            })

            res.json(data.imageUrl)


        } else {



            const check2 = await nopostdp.findOne({ username: req.body.usn })
            if (check2 != null) {

                const data = await imgsd.create({
                    username: req.body.usn,
                    imageUrl: imageUrl,
                    about: req.body.about,
                    dp: check2.dp,

                })

                res.json(data.imageUrl)


            } else {
                const data = await imgsd.create({
                    username: req.body.usn,
                    imageUrl: imageUrl,
                    about: req.body.about,

                })

                res.json(data.imageUrl)
            }





        }

    }

)





//all posts


app.post('/allpost', async(req, res) => {

        const usn = req.body.usn;

        const user = await abc.find({ acceptedbyme: usn })
        const us = user.map(u => u.username);


        const foundUsers = await imgsd.find({ username: { $in: us } }).sort({ createdAt: -1 }).limit(25);

        const response = foundUsers.map((doc) => {
            return {
                imageUrl: doc.imageUrl,
                username: doc.username,
                about: doc.about,
                dp: doc.dp,
                createdAt: doc.createdAt,
                likes: doc.likes,
                comments: doc.comments,
                commentedby: doc.commentedby,


            };
        });


        res.json(response);


    }

)



// get my all posts 


app.post('/mypost', async(req, res) => {

        const check = await imgsd.find({ username: req.body.usn }).sort({ createdAt: -1 })



        if (check) {
            const response = check.map((doc) => {
                return {
                    imageUrl: doc.imageUrl,
                    username: doc.username,
                    about: doc.about,

                    createdAt: doc.createdAt,
                };
            });
            res.json(response)
        } else {

            res.status(204).json({ message: 'No data available' });



        }


    }

)



//single post


app.post('/singleposts', async(req, res) => {

        let u = req.body.createdAt;

        const check = await imgsd.findOne({ createdAt: u });

        if (check) {

            return res.json(check)
        } else {

            return res.json(check)
        }

    }

)



app.post('/delete', async(req, res) => {

        let u = req.body.createdAt;

        await imgsd.deleteOne({ createdAt: u });


    }

)



app.post('/edit', async(req, res) => {

        let u = req.body.createdAt;
        const check = await imgsd.findOne({ createdAt: u }).updateOne({ about: req.body.edit });


        const check2 = await imgsd.findOne({ createdAt: u })
        res.json(check2.about);





    }

)




if (process.env.API_Port) {

    app.listen(process.env.API_Port);


}


//update dp
app.post('/dps', upload.single('dp'), async(req, res) => {



        const check2 = await imgsd.find({ username: req.body.usn }).updateMany({ dp: req.file.path });
        if (check2.upsertedId != null) {

            res.json(check2.dp)

        } else {


            const cd = await nopostdp.findOne({ username: req.body.usn })


            if (cd) {

                const check2 = await nopostdp.find({ username: req.body.usn }).updateMany({ dp: req.file.path });

                const c = await nopostdp.findOne({ username: req.body.usn })

                res.json(c.dp)


            } else {



                const data = await nopostdp.create({
                    username: req.body.usn,
                    dp: req.file.path,

                })

                const c = await nopostdp.findOne({ username: req.body.usn })

                res.json(c.dp)



            }





        }





    }

)

//current dp
app.post('/currentdp', upload.single('dp'), async(req, res) => {






        const check2 = await imgsd.findOne({ username: req.body.usn })


        if (check2 != null) {


            if (check2.dp) {

                res.json(check2.dp)



            } else {

                const check2 = await nopostdp.findOne({ username: req.body.usn })

                if (check2 != null) {

                    res.json(check2.dp)
                } else {

                    res.json(check2)



                }


            }

        } else {

            const check2 = await nopostdp.findOne({ username: req.body.usn })

            if (check2) {


                res.json(check2.dp)


            } else {

                res.status(204).json({ message: 'No data available' });

            }



        }









    }

)


app.post('/friendrequestfromsender', async(req, res) => {

    const sender = req.body.sender;
    const usn = req.body.usn;

    const user = await abc.findOne({ username: usn });
    if (user.requestfrompeople.includes(sender)) {
        res.status(204).json({ message: 'No data available' });



    } else {
        await abc.findOneAndUpdate({ username: usn }, { $push: { requestfrompeople: sender } }, { new: true });

        const updatedUser = await abc.findOne({ username: usn });
        res.json("Friend request sent");

    }
});




app.post('/allnotifications', async(req, res) => {

        //usn is reciever 
        const usn = req.body.usn


        const existing = await abc.findOne({ username: usn })

        if (existing.requestfrompeople.length > 0) {
            res.json(existing.requestfrompeople.reverse())


        } else {

            res.json(null)


        }



    }

)

//delete request from notifications
app.post('/deleterequest', async(req, res) => {
    let index = req.body.index;

    const use = await abc.findOne({ username: req.body.usn });
    const blogIndex = parseInt(index);
    use.requestfrompeople.splice(blogIndex, 1); // delete the blog post at the specified index
    await use.save();
    res.json(use.requestfrompeople);

});




// accept request from notifications
app.post('/acceptrequest', async(req, res) => {
    let index = req.body.index;

    const use = await abc.findOne({ username: req.body.usn });
    const pIndex = parseInt(index);

    const removed = use.requestfrompeople.splice(pIndex, 1);
    use.acceptedbyme.push(removed[0]);

    await use.save();


    const existing = await abc.findOne({ username: req.body.usn })

    if (existing != null) {
        res.json(existing.requestfrompeople.reverse())
    }



});






app.post('/alreadyrequestedorno', async(req, res) => {

    const sender = req.body.sender;
    const usn = req.body.usn;

    const user = await abc.findOne({ username: usn });


    if (user) {
        if (user.requestfrompeople.includes(sender)) {
            return res.json("alreadyrequested");
        }

        if (user.acceptedbyme.includes(sender)) {

            return res.json("following");


        } else {
            return res.json(null);



        }
    }
});

//autocomplete recomandation
app.get('/users', async(req, res) => {
    const { q } = req.query;
    const users = await abc.find({
        username: { $regex: new RegExp(q, 'i') }
    }, { _id: 0, username: 1 });
    res.json(users);





});




app.post('/follow', async(req, res) => {

        let u = req.body.usn;


        const check2 = await abc.findOne({ username: u })
        if (check2) {


            // Get the length of the acceptedbyme array without counting null values
            const acceptedByMe = check2.acceptedbyme || [];



            const nonNullAcceptedByMe = acceptedByMe.filter(value => value !== null);
            const followers = nonNullAcceptedByMe.length;

            //following 
            const che = await abc.find({ acceptedbyme: u })

            const following = che.length;


            res.json({ following, followers });

        } else {


            res.status(204).json({ message: 'No data available' });

        }

    }

)




app.post('/addtolikes', async(req, res) => {

        const postowner = req.body.postowner
        const createdtime = req.body.createdtime;
        const usn = req.body.usn;

        const check = await imgsd.findOneAndUpdate({ username: postowner, createdAt: createdtime }, { $push: { likes: usn } });










        const user = await abc.find({ acceptedbyme: usn })
        const us = user.map(u => u.username);


        const foundUsers = await imgsd.find({ username: { $in: us } }).sort({ createdAt: -1 })

        const response = foundUsers.map((doc) => {
            return {
                imageUrl: doc.imageUrl,
                username: doc.username,
                about: doc.about,
                dp: doc.dp,
                createdAt: doc.createdAt,
                likes: doc.likes,
                comments: doc.comments,
                commentedby: doc.commentedby,


            };
        });


        res.json(response);


    }

)




// add to likes from all post taps


app.post('/addtolikesfromallposttap', async(req, res) => {

        const created = req.body.createdAt;
        const usn = req.body.usn;

        const check = await imgsd.findOneAndUpdate({ createdAt: created }, { $push: { likes: usn } });
        const resp = await imgsd.find({ createdAt: created })




        res.json(resp)




    }

)


//how many likes from all post taps



app.post('/howmmanylike', async(req, res) => {

        const created = req.body.createdAt;

        const resp = await imgsd.find({ createdAt: created })




        res.json(resp)




    }

)







app.post('/likedornot', async(req, res) => {


        const usn = req.body.usn;


        const users = await imgsd.find({ likes: usn }, { createdAt: 1 });
        const crt = users.map(crtr => crtr.createdAt);



        res.json(crt);


    }

)



app.post('/postcomment', async(req, res) => {


        const commentposted = req.body.mycomment;
        const loggedinusn = req.body.usn;
        const posteduser = req.body.posteduser;
        const postcreatedat = req.body.postcreatedat

        const check = await imgsd.findOneAndUpdate({ username: posteduser, createdAt: postcreatedat }, { $push: { comments: commentposted } })

        const check2 = await imgsd.findOneAndUpdate({ username: posteduser, createdAt: postcreatedat }, { $push: { commentedby: loggedinusn } })


        const resp = await imgsd.find({}).sort({ createdAt: -1 })

        const response = resp.map((doc) => {
            return {
                imageUrl: doc.imageUrl,
                username: doc.username,
                about: doc.about,
                dp: doc.dp,
                createdAt: doc.createdAt,
                likes: doc.likes,
                comments: doc.comments.reverse(),
                commentedby: doc.commentedby.reverse(),


            };
        });

        res.json(response)




    }

)





app.post('/postcommentofpersonal', async(req, res) => {


        const commentposted = req.body.mycomment;
        const loggedinusn = req.body.usn;
        const postcreatedat = req.body.postcreatedat

        const check = await imgsd.findOneAndUpdate({ createdAt: postcreatedat }, { $push: { comments: commentposted } })

        const check2 = await imgsd.findOneAndUpdate({ createdAt: postcreatedat }, { $push: { commentedby: loggedinusn } })


        const c = await imgsd.findOne({ createdAt: postcreatedat });

        if (c) {

            return res.json(c)
        } else {

        }





    }

)

app.post('/postcommentontaponallposts', async(req, res) => {


        const commentposted = req.body.mycomment;
        const loggedinusn = req.body.usn;
        const postcreatedat = req.body.postcreatedat

        const check = await imgsd.findOneAndUpdate({ createdAt: postcreatedat }, { $push: { comments: commentposted } })

        const check2 = await imgsd.findOneAndUpdate({ createdAt: postcreatedat }, { $push: { commentedby: loggedinusn } })


        const c = await imgsd.findOne({ createdAt: postcreatedat });

        if (c) {

            return res.json(c)
        } else {

        }





    }

)






//me following 


app.post('/mefollowingallpost', async(req, res) => {


        const usn = req.body.usn;


        const users = await abc.find({ acceptedbyme: usn });

        const response = users.map((doc) => {
            return doc.username;
        });


        res.json(response)
    }

)


//chatting 



//getting all following usn 




app.post('/allmyfollowersforchats', async(req, res) => {


        const usn = req.body.usn;


        const users = await abc.find({ acceptedbyme: usn });

        const response = users.map((doc) => {
            return doc.username;
        });


        res.json(response)


    }

)



//creating message model 




app.post('/creatingchatmodal', async(req, res) => {


    const dpofsender = await imgsd.findOne({ username: req.body.usn })
    const dpofreciever = await imgsd.findOne({ username: req.body.personalchatusername })





    const data = await messagemodel.create({
        sender: req.body.usn,
        reciever: req.body.personalchatusername,
        message: req.body.message,
        senderdp: dpofsender.dp,
        recieverdp: dpofreciever.dp

    })





    const response = await messagemodel.find({
        $or: [
            { sender: req.body.usn, reciever: req.body.personalchatusername },
            { sender: req.body.personalchatusername, reciever: req.body.usn }
        ]
    }).sort({ createdAt: 1 });




    const re = response.map((doc) => {
        return {
            sender: doc.sender,
            reciever: doc.reciever,
            message: doc.message,
            createdAt: doc.createdAt



        };
    });

    res.json(re)





})


app.post('/printingpreviousmessages', async(req, res) => {




    const response = await messagemodel.find({
        $or: [
            { sender: req.body.usn, reciever: req.body.personalchatusername },
            { sender: req.body.personalchatusername, reciever: req.body.usn }
        ]
    }).sort({ createdAt: 1 });




    const re = response.map((doc) => {
        return {
            sender: doc.sender,
            reciever: doc.reciever,
            message: doc.message,
            createdAt: doc.createdAt




        };
    });

    res.json(re)


})









app.post('/checkforsec', async(req, res) => {

    const response = await messagemodel.find({
        $or: [
            { sender: req.body.usn, reciever: req.body.personalchatusername },
            { sender: req.body.personalchatusername, reciever: req.body.usn }
        ]
    }).sort({ createdAt: 1 });

    const now = new Date().getTime();
    const onMessages = response.filter((doc) => {
        const messageCreatedAt = new Date(doc.createdAt).getTime();
        const diff = (now - messageCreatedAt) / 1000;
        return diff <= 10;
    });





    // res.json(onMessages.length > 0 ? 'ons' : 'offs');




    if (onMessages.length > 0) {



        res.json("callbro")



    } else {


        res.json("no")



    }








});


//gettong  dp for chats 




app.post('/dpforchat', async(req, res) => {




    const response = await imgsd.find({ username: req.body.personalchatusername })




    res.json(response[0].dp)







})











app.post('/recentchatsdisplay', async(req, res) => {

    const arr = [];
    const user = await abc.findOne({ username: req.body.usn });
    user.acceptedbyme.forEach((element) => {
        arr.push(element);
    });

    const users = await abc.find({ acceptedbyme: req.body.usn });

    const response = users.map((doc) => {
        return doc.username;
    });

    const mergedArray = [...new Set(arr.concat(response))];

    const recentChats = [];

    for (let i = 0; i < mergedArray.length; i++) {
        const chat = await messagemodel.findOne({ sender: req.body.usn, reciever: mergedArray[i] })
            .sort({ createdAt: -1 })
            .limit(1);
        if (chat) {
            recentChats.push({
                sender: req.body.usn,
                reciever: mergedArray[i],
                message: chat.message,
                senderdp: chat.senderdp,
                recieverdp: chat.recieverdp,
                createdAt: chat.createdAt
            });
        }
    }

    for (let i = 0; i < mergedArray.length; i++) {
        const chat = await messagemodel.findOne({ sender: mergedArray[i], reciever: req.body.usn })
            .sort({ createdAt: -1 })
            .limit(1);
        if (chat) {
            recentChats.push({
                sender: mergedArray[i],
                reciever: req.body.usn,
                message: chat.message,
                senderdp: chat.senderdp,
                recieverdp: chat.recieverdp,
                createdAt: chat.createdAt
            });
        }
    }

    // Remove duplicates and sort by createdAt
    recentChats.sort((a, b) => b.createdAt - a.createdAt);
    const uniqueChats = [];
    recentChats.forEach((chat) => {
        const foundChat = uniqueChats.find((c) => c.sender === chat.reciever && c.reciever === chat.sender);
        if (!foundChat) {
            uniqueChats.push(chat);
        } else {
            if (chat.createdAt > foundChat.createdAt) {
                uniqueChats.splice(uniqueChats.indexOf(foundChat), 1);
                uniqueChats.push(chat);
            }
        }
    });

    res.json(uniqueChats);




});










app.post('/storycreation', upload.single('image'), async(req, res) => {
    const imageUrl = req.file.path;


    const c = await imgsd.findOne({ username: req.body.usn });



    if (c) {
        const data = await storycreate.create({
            username: req.body.usn,
            storyUrl: imageUrl,
            dp: c.dp,
        });
    } else {
        const check2 = await nopostdp.findOne({ username: req.body.usn });
        if (check2) {
            const data = await storycreate.create({
                username: req.body.usn,
                storyUrl: imageUrl,
                dp: check2.dp,
            });
        } else {
            const data = await storycreate.create({
                username: req.body.usn,
                storyUrl: imageUrl,
            });
        }
    }

    res.json(imageUrl);
});




//get all the stories 



app.post('/getallstories', async(req, res) => {

        const usn = req.body.usn;
        const user = await abc.find({ acceptedbyme: usn });
        const us = user.map(u => u.username);

        const foundUsers = await storycreate.find({ username: { $in: us } });


        const response = foundUsers.map((doc) => {
            return {
                username: doc.username,
                dp: doc.dp,
                storyUrl: doc.storyUrl,
                createdAt: doc.createdAt


            };
        });

        res.json(response)
    }

)

//single story

app.post('/singlestory', async(req, res) => {

        let u = req.body.particularstory;

        const check = await storycreate.findOne({ username: u });

        if (check) {

            return res.json(check)
        } else {

            return res.json(check)
        }

    }

)












app.post('/deletestory', async(req, res) => {

        let usn = req.body.usn;


        const delet = await storycreate.findOneAndDelete({ username: usn });




        res.json(delet)



    }

)

//find if story is there or no 

app.post('/storyexistingorno', async(req, res) => {

        let usn = req.body.usn;


        const delet = await storycreate.findOne({ username: usn });


        if (delet) {


            res.json(delet)
        } else {


            res.json("nostorythere")
        }


    }

)





app.post('/storythereorno', async(req, res) => {

        let usn = req.body.usern;


        const delet = await storycreate.findOne({ username: usn });


        if (delet) {

            res.json("there")
        } else {


            res.json("nostorythere")
        }


    }

)




app.post('/storythereornoofallstories', async(req, res) => {

        let usn = req.body.usn;


        const delet = await storycreate.findOne({ username: usn });


        if (delet) {

            res.json("there")
        } else {


            res.json("nostorythere")
        }


    }



)



//seen in msg



app.post('/mybio', async(req, res) => {





    const respons = await abc.findOne({ username: req.body.usn })
    if (respons) {

        res.json(respons.bio)
    } else {
        res.status(204).json({ message: 'No data available' });

    }




})



app.post('/changebio', async(req, res) => {




    const respons = await abc.findOne({ username: req.body.usn }).updateOne({ bio: req.body.editbio })

    res.json(req.body.editbio)




})








module.exports = app;
