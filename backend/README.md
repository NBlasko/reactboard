[x] confirm pass via email
[x] infinite scroll
[x] style add message component
[x] in add message component don't forget "preview" part
[x] add date in listed Blogs, profiles...
[x] style and create data from profile component
    [x] on profile would be nice to have a history of all blogs user posted,
    [] maybe track all comments
    [] add a total of trust in separate row, bellow coins, it will look more rich (number of trust's and non-trust's)
    [] while listing profiles, images are not in the same size (google ones are specially small), make the all the same size

[x] add hover to social buttons on login form
[] add coins, this is going to be a long one
        [] on passed time, to recharge profile with coins
        [] add components on fronend to render a message when there are no coins, it's forbiden to view
[x] query db by ,start at nth, limit last 10 by
        [x] blogs views
        [x] number and percent of likes
        [x] number and percent of trust
[x] fix blank options in dropdown
[x] add profile image everywhere
        [x] with email, save it to cloudinary, and hide the image url via backend
[x] validate query string like params and body via joi
        [x] for blogs
        [x] for profiles
[x] add uuid in mongoose schema instead like uuidv1(); example publicID:{ type: String, default: uuidv1 }
[x] add a constant for server URL like const serverURL = http://localhost:3001/
[x] user should be able to delete it's blog

[] fix bugs
        [x] delete button is visible in non-admin image galleries (next time I checked everithing was fine)
        [] button for "load more images" in image gallery apear when the gallery is empty and
        the button is not desapearing when it is clicked
        [x] searchedProfile delete data on unmount

[] structure code, 
        [] max 200 lines per file
        [] break into smaller components
        [] add all explanation comments for code
        [] chenge bootstrap into reactstrap as much as you can

[] blogs and profiles look almost the same. Add h1 names or different color to distinguish them

[] deploy

#Notes
Images will be fetched via web server
Strategy will be to confirm auth throug a specific endpoint, and based on response status image will be delivered
Example.
https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-subrequest-authentication/


TrustVote and UserProfile share same id
Blog and LikeVote share same id
User Id is secret