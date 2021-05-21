[x] style and create data from profile component
    [x] on profile would be nice to have a history of all blogs user posted,
    [] maybe track all comments
    [] add a total of trust in separate row, bellow coins, it will look more rich (number of trust's and non-trust's)
    [] while listing profiles, images are not in the same size (google ones are specially small), make the all the same size

[] add coins, this is going to be a long one
        [] on passed time, to recharge profile with coins
        [] add components on fronend to render a message when there are no coins, it's forbiden to view


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