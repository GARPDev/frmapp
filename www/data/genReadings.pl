open("OUT",">readings.json");

@topics = ('Foundations of Risk Management', 'Quantitative Analysis', 'Financial Markets and Products', 'Valuation and Risk Models'); 

@book_authors = ('Edwin J. Elton, Martin J. Gruber, Stephen J. Brown and William N. Goetzmann', 'Zvi Bodie, Alex Kane, and Alan J. Marcus', 'Noel Amenc and Veronique Le Sourd', 'Dr. Larry Rittenberg and Frank Martens','Anthony Tarantino and Deborah Cernauskas','Steve Allen','René Stulz'); 
@book_titles = ('Risk Taking: A Corporate Governance Perspective', 'Modern Portfolio Theory and Investment Analysis, 8th Edition','Investments','Portfolio Theory and Performance Analysis','Understanding and Communicating Risk Appetite','Risk Management in Finance: Six Sigma and Other Next Generation Techniques','Financial Risk Management: A Practitioner’s Guide to Managing Market and Credit Risk','Risk Management Failures: What are They and When Do They Happen?'); 
@book_pubs = ('International Finance Corporation, World Bank Group, June 2012','Hoboken, NJ: John Wiley & Sons, 2009','9th Edition New York: McGraw-Hill, 2010','West Sussex, England: John Wiley & Sons, 2003','COSO, January 2012','Hoboken, NJ: John Wiley & Sons, 2009','New York: John Wiley & Sons, 2013','Fisher College of Business Working Paper Series, October 2008'); 

@chapters = ('.The Standard Capital Asset Pricing Model','Arbitrage Pricing Theory and Multifactor Models of Risk and Return','Applying the CAPM to Performance Measurement: Single-Index Performance Measurement Indicators','','Information Risk and Data Quality Management','Financial Disasters'); 


$MAX_BOOKS = 3;
$MAX_CHAPTERS = 3;
$MAX_SECTIONS = 5;


print OUT "{\n";
print OUT "\"id\":\"frm01\",\n";
print OUT "\"readings\":[\n";

# Books
for($i=1; $i<=$MAX_BOOKS; $i++) {

	$pi = $i;
	if($i<10) { $pi = "0${i}"; }
	
	# Chapters
	for($j=1; $j<=$MAX_CHAPTERS; $j++) {

		$pj = $j;
		if($j<10) { $pj = "0${j}"; }

		# Sections
		for($k=1; $k<=$MAX_SECTIONS; $k++) {

			$pk = $k;
			if($k<10) { $pk = "0${k}"; }			


			my $author = @book_authors;
			my $random_author = int(rand($author));

			my $title = @book_titles;
			my $random_title = int(rand($title));

			my $pub = @book_pubs;
			my $random_pub = int(rand($pub));

			my $chap = @chapters;
			my $random_chap = int(rand($chap));


			my $week = 20;
			my $random_week = int(rand($week)) + 1;
			
			$prandom_week = $random_week;
			if($random_week<10) { $prandom_week = "0${random_week}"; }

			my $topic = 4;
			my $random_topic = int(rand($topic));

			$prandom_topic = $random_topic + 1;
			if($random_topic<10) { $prandom_topic = "0${random_topic}"; }

			my $attachment = 2;
			my $random_attachment = int(rand($attachment));


			print OUT "{\n";
			print OUT "\"id\": \"B${pi}C${pj}S${pk}\",\n";
			print OUT "\"book\": { \"id\":\"${pi}\", \"title\":\"$book_titles[$random_title]\", \"author\":\"$book_authors[$random_author]\", \"publisher\":\"$book_pubs[$random_pub]\"},\n";
			print OUT "\"chapter\": { \"id\":\"${pj}\", \"title\":\"$chapters[$random_chap]\"},\n";
			print OUT "\"section\": { \"id\":\"${pk}\", \"title\":\"Section ${pk}\"},\n";
			print OUT "\"week\": { \"id\":\"${prandom_week}\", \"order\":${random_week}, \"title\":\"Week ${random_week}\"},\n";
			print OUT "\"topic\": { \"id\":\"${prandom_topic}\", \"order\":${random_topic}, \"title\":\"$topics[$random_topic]\"},\n";
			print OUT "\"attachment\" : { \n";

			if($random_attachment) {

				print OUT "\"url\": \"http://frmapp.garp.org/books/frm1.pdf\",\n"; 
				print OUT "\"name\": \"FRM-1\",\n"; 
				print OUT "\"description\": \"Freely available on the GARP Digital Library.\"\n";
			}

			print OUT "} \n";


			print OUT "},\n";


		}

	}

}


print OUT "]\n";
print OUT "}\n";