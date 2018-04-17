<?

error_reporting(1);
extract($_GET);

// include_once("trie.php");


function permute($arg) {
    $array = is_string($arg) ? str_split($arg) : $arg;
    if(1 === count($array)) {
        return $array;
    }
    $result = array();
    foreach($array as $key => $item) {
        foreach(permute(array_diff_key($array, array($key => $item))) as $p) {
            $result[] = $item . $p;
        }
    }
    return $result;
}

if ($term) {


}

$words = array_map("trim", file('wordlist.txt'));
$term = strToLower($term);
$pos = strpos($term, "_");
$results = [];
if ($pos === false) {
	$perms = permute($term);
	foreach($words as $i=>$word) {
		foreach($perms as $perm) {
			if (preg_match("/^.*".$perm.".*$/i", $word) === 1) {
				$results[$i] = $word;
			}
		}
	}
}
else {
	$perms = [$term];
	foreach($words as $i=>$word) {
		foreach($perms as $perm) {
			$search = $perm;
			// echo $search."\n";
			// $search = str_replace("%", ".*", $search);
			$search = str_replace("%", ".*", $search);
			$search = str_replace("_", ".", $search);
			$search = "/^.*".$search.".*$/i";
			if ((preg_match($search, $word) === 1 and strpos($term, "%") === false)
			and strlen($word) === strlen($term)) {
				$results[$i] = $word;
			}
		}
	}
}



// array_unshift($results, $search);
// echo $search."\n";
// echo $results;
// print_r($results);
echo json_encode($results);






