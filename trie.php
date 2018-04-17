<?php

include_once("trie.class.php");

// Testing code here
// Using TWL06

// $mtime = microtime();
// $mtime = explode(" ",$mtime);
// $mtime = $mtime[1] + $mtime[0];
// $starttime = $mtime;

$twl06 = explode("\n", file_get_contents("wordlist.txt"));

// $mem = memory_get_usage();
// echo $mem . " listed alone.<br>";

// $twl06 = array_slice($twl06, 0, 100000); // Too much memory allocated, test with just a portion

// $mem2 = memory_get_usage();
// echo $mem2 . " sliced.<br>";

// Eventually check memory usages with get_memory_usage

$trie = new Trie();

foreach($twl06 as $val) {
	$trie->add(trim($val));
}

// $mem_trie = memory_get_usage();
// echo ($mem_trie - $mem2) . " in trie.<br>";

// $mtime = microtime();
// $mtime = explode(" ",$mtime);
// $mtime = $mtime[1] + $mtime[0];
// $totaltime = $mtime - $starttime;


// print_r($trie->getVal("wo"));
// print_r($trie->listWords("wo"));


?>