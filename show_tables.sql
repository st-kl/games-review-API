
\c nc_games_test

SELECT 
  reviews.*,
  COUNT(comments.comment_id)
FROM 
  comments
LEFT JOIN
  reviews
ON
  comments.review_id = reviews.review_id
GROUP BY
  reviews.review_id;


