/**
 * Created by tcs on 19/05/17.
 */

/*
 *	Learn: https://www.codeschool.com/courses/try-docker
 */

var Maquina = function (nome, status, velocidade_producao) {
	var status; // 0: parado, 1: produzindo.
	var evento_inicio = null;
	var velocidade_padrao = velocidade_producao;
	
	this.pecas_produzidas = 0;
	this.refugo = 0;

	this.tempo_produzindo = 0;
	this.tempo_parado = 0;

	this.produzindo_interval = 0;
	this.parado_interval = 0;
	
	this.velocidade_producao = velocidade_producao; // 1 peça a cada X segundos.
	this.nome = nome;

	this.Produzir = function () {
		clearInterval(this.parado_interval);
		this.velocidade_producao = velocidade_padrao; // Inicio ou reinicio da máquina.

		if (evento_inicio !== null)
			this.tempo_parado += Date.now() - evento_inicio;

		evento_inicio = Date.now();
		status = 1;
		this.produzindo_interval = setInterval(function (maq) {
			maq.pecas_produzidas++;

			// Mudar de status aleatoriamente para simular.
			var random = Math.random();

			if (random < 0.175)
				maq.Parar();
			else if (random < 0.25)
				maq.velocidade_producao *= 1 + (Math.random() * 0.5);
			else if (random < 0.325)
				maq.velocidade_producao *= 1 - (Math.random() * 0.5);

			if (maq.velocidade_producao < 1)
				maq.velocidade_producao = 1;
		}, this.velocidade_producao * 1000, this);
	}

	this.Parar = function () {
		clearInterval(this.produzindo_interval);

		if (evento_inicio !== null)
			this.tempo_produzindo += Date.now() - evento_inicio;

		evento_inicio = Date.now();
		status = 0;
		this.parado_interval = setInterval(function (maq) {
			maq.refugo++;

			// Mudar de status aleatoriamente para simular.
			if (Math.random() < 0.425)
				maq.Produzir();

		}, this.velocidade_producao * 1000, this);
	}
	
	this.GetStatusInt = function () {
		return status;
	}
	
	this.GetStatus = function () {
		return status == 1 ? "Produzindo" : "Parado";
	}
	
	if (status == 1)
		this.Produzir();
	else
		this.Parar();
	
	setInterval(function (maq) {
		if (evento_inicio !== null) {
			if (maq.GetStatusInt() == 0)
				maq.tempo_parado += Date.now() - evento_inicio;
			else if (maq.GetStatusInt() == 1)
				maq.tempo_produzindo += Date.now() - evento_inicio;

			evento_inicio = Date.now();
		}
	}, 1000, this);
}

function FormatarTempo (ms, includeMS) {
	var anos = Math.floor(ms / 31104000000);
	ms -= anos * 31104000000;

	var meses = Math.floor(ms / 2592000000);
	ms -= meses * 2592000000;
	
	var dias = Math.floor(ms / 86400000);
	ms -= dias * 86400000;
	
	var horas = Math.floor(ms / 3600000);
	ms -= horas * 3600000;
	
	var minutos = Math.floor(ms / 60000);
	ms -= minutos * 60000;
	
	var segundos = Math.floor(ms / 1000);
	ms -= segundos * 1000;
	
	var result = "";
	if (anos > 0)
		result += anos.toString() + (anos > 1 ? " anos " : " ano ");

	if (meses > 0 || anos > 0)
		result += meses.toString() + (meses > 1 ? " meses " : " mês ");
	
	if (dias > 0 || meses > 0 || anos > 0)
		result += dias.toString() + (dias > 1 ? " dias " : " dia ");

	if (horas > 0 || dias > 0 || meses > 0 || anos > 0)
		result += horas.toString() + (horas > 1 ? " horas " : " hora ");

	if (minutos > 0 || horas > 0 || dias > 0 || meses > 0 || anos > 0)
		result += minutos.toString() + (minutos > 1 ? " minutos " : " minuto ");

	result += segundos.toString() + (segundos > 1 ? " segundos" : " segundo");
	
	if (includeMS)
		result += " " + ms.toString() + "ms"

	return result;
}

var maquinas_global = [];