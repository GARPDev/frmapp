open("OUT",">questions.json");

@answers = ('A','B','C','D'); 

$MAX_QUESTIONS = 30;
$MAX_READINGS = 5;

$MAX_BOOKS = 3;
$MAX_CHAPTERS = 3;
$MAX_SECTIONS = 5;


print OUT "{\n";
print OUT "\"id\":\"FRM2013\",\n";
print OUT "\"questions\":[\n";


# Books
for($i=1; $i<=$MAX_QUESTIONS; $i++) {

	$pi = $i;
	if($i<10) { $pi = "0${i}"; }

  my $answer = @answers;
  my $random_answer = int(rand($answer));

  my $random_reading = int(rand($MAX_READINGS));

  print OUT "{\n";
  print OUT "\"id\":\"${pi}\", \n";

  print OUT "\"question\":\"The efficient frontier is defined by the set of portfolios that, for each volatility level, maximizes the expected return. According to the capital asset pricing model (CAPM), which of the following statements are correct with the respect to the efficient frontier?\", \n";
  print OUT "\"reason\":\"<p>Because within modern portfolio theory (MPT), the efficient frontier is a combination of assets that has the best possible expected level of return for its level of risk. The efficient frontier is the positively sloped portion of the opportunity set that offers the highest expected return for a given risk level. The efficient frontier is at the top of the feasible est of portfolio combinations. ii, iii, and v are correct statements.</p> <p>The capital market line connects the risk-free asset and the market portfolio. The efficient frontier does allow investors to have different risk aversions, but assumes that they all have the same forecast for asset returns.</p>\", \n";
  print OUT "\"choices\":[ \n";
  print OUT "{\"id\":\"i\", \"description\":\"The capital market line is the straight line connecting the risk-free asset with the zero beta minimum variance portfolio.\"}, \n";
  print OUT "{\"id\":\"ii\", \"description\":\"The capital market line always has a positive slope and its steepness depends on the market risk premium and the volatility of the market portfolio.\"}, \n";
  print OUT "{\"id\":\"iii\", \"description\":\"The complete efficient frontier without a risk-free asset can be obtained by combining the minimum variance portfolio and the market portfolio.\"}, \n";
  print OUT "{\"id\":\"iv\", \"description\":\"The efficient frontier allows different individuals to have different portfolios of risky assets based upon their own risk aversion and forecast for asset returns.\"}, \n";
  print OUT "{\"id\":\"v\", \"description\":\"The efficient frontier assumes no transaction costs, no taxes, a common investment horizon for all investors, and that the return distribution has no skewness.\"} \n";
  print OUT "], \n";

	print OUT "\"answer\": \"$answers[$random_answer]\", \n";

  print OUT "\"answers\" : [ \n";
  print OUT "{\"id\": \"A\", \"answer\":  \"ii, iii and v\"}, \n";
  print OUT "{\"id\": \"B\", \"answer\":  \"i, ii and iii\"}, \n";
  print OUT "{\"id\": \"C\", \"answer\":  \"i, iv and v\"}, \n";
  print OUT "{\"id\": \"D\", \"answer\":  \"ii, iii and iv\"} \n";
  print OUT "], \n";
  print OUT "\"readings\" : [ \n";

  for($j=1; $j<=$random_reading; $j++) {

    my $random_book = int(rand($MAX_BOOKS));
    if($random_book<10) { $random_book = "0${random_book}"; }

    my $random_chapter = int(rand($MAX_CHAPTERS));
    if($random_chapter<10) { $random_chapter = "0${random_chapter}"; }

    my $random_section = int(rand($MAX_SECTIONS));
    if($random_section<10) { $random_section = "0${random_section}"; }

    if($j == $random_reading) {
      print OUT "\"B${random_book}C${random_chapter}S${random_section}\" \n";
    } else {
      print OUT "\"B${random_book}C${random_chapter}S${random_section}\", \n";
    }
    
  }

  print OUT "] \n";

  if($i == $MAX_QUESTIONS) {
    print OUT "}\n";
  } else {
    print OUT "},\n";
  }
}

print OUT "]\n";
print OUT "}\n";