var express = require("express");
var connection = require("../helper/dbConnection");
const router = express.Router();
const { validationResult, body } = require("express-validator");

selectGender = (queryString, gender) => {
  if (gender.toLowerCase() == "boy") {
    return queryString + " gender='Boy' ";
  } else if (gender.toLowerCase() == "girl") {
    return queryString + " gender='Girl' ";
  } else {
    return queryString;
  }
};

selectReligion = (queryString, religion) => {
  switch (religion.toLowerCase()) {
    case "islam":
    case "muslims":
      return queryString + " cat_numaric=3 ";
    case "hinduism":
    case "hindu":
    case "hindi":
      return queryString + " cat_numaric=2 AND urdu_name='Hindi' ";
    case "sikh":
      return queryString + " urdu_name='Sikh' ";
    case "christian":
    case "christianity":
      return queryString + " origen_id=20 ";
    case "jews":
    case "jewish":
      return queryString + " urdu_name='hebrew' ";
    default:
      return queryString;
  }
};

selectKeywordOrAlphabet = (queryString, keyword, alphabet) => {
  if (keyword !== "") {
    return " name LIKE '%" + keyword.toLowerCase() + "%'";
  } else if (alphabet !== "") {
    return " name LIKE '" + alphabet.toLowerCase() + "%'";
  } else {
    return queryString;
  }
};

router.post(
  "/",
  body(
    "keyword",
    "keyword field is required, it can be empty but cannot be null"
  ).exists(),
  body(
    "religion",
    "religion field is required, it can be empty but cannot be null"
  ).exists(),
  body(
    "gender",
    "gender field is required, it can be empty but cannot be null"
  ).exists(),
  body(
    "alphabet",
    "alphabet field is required, it can be empty but cannot be null"
  ).exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors });
    }
    // create db connection
    try {
      const con = await connection();
      const { keyword, religion, gender, alphabet } = req.body;
      // lets prepare our query
      const Limit_string = " ORDER BY name ASC limit 0,100";
      let genderString = "";
      let religionString = "";
      let keywordString = "";

      let queryString = "SELECT * FROM all_names";
      // add gender to string
      genderString = selectGender(genderString, gender);
      // add religion to string
      religionString = selectReligion(religionString, religion);
      // add keyword or alphabet string
      keywordString = selectKeywordOrAlphabet(keywordString, keyword, alphabet);
      //now add row limits to our results
      if (
        genderString !== "" ||
        religionString !== "" ||
        keywordString !== ""
      ) {
        queryString = queryString + " WHERE ";
      }
      if (genderString !== "") {
        queryString =
          queryString +
          genderString +
          (religionString !== "" || keywordString !== "" ? " AND " : "");
      }
      if (religionString !== "") {
        queryString =
          queryString + religionString + (keywordString !== "" ? " AND " : "");
      }
      if (keywordString !== "") {
        queryString = queryString + keywordString;
      }
      queryString = queryString + Limit_string;

      con.query(queryString, function (err, result, fields) {
        if (err) throw err;
        res.send(result);
      });
    } catch (error) {
      res
        .status(500)
        .json({ errors: [{ msg: "Internal server Errors" + error }] });
    }
  }
);

router.get("/trendingNames", async (req, res) => {
  // create db connection
  try {
    const con = await connection();
    // lets prepare our query
    let queryString =
      "SELECT * FROM all_names ORDER BY max_click DESC limit 0,100";
    con.query(queryString, function (err, result, fields) {
      if (err) throw err;
      res.send(result);
    });
  } catch (error) {
    res.status(500).send("Internal server Error" + error);
  }
});

module.exports = router;
