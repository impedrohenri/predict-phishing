import pandas as pd
import re
import math
import tldextract
from urllib.parse import urlparse, parse_qs, unquote
import ipaddress
from collections import Counter
import math
import socket
from sklearn.feature_extraction.text import TfidfVectorizer

def feature_extraction(url):
    df = pd.DataFrame([url], columns=['url'])

    def Num_Dots(df):
            def count_dots(u):
                try:
                    decoded = unquote(u)
                    return decoded.count('.') - decoded.count('%.')
                except:
                    return 0
                    
            df['NumDots'] = df['url'].apply(count_dots).astype(int)
            return df
    Num_Dots(df)  # Chamada fora do bloco def


    def SubdomainLevel(df):
        extract = tldextract.TLDExtract()
        def get_level(u):
            try:
                result = extract(u)
                return len(result.subdomain.split('.')) if result.subdomain else 0
            except:
                return 0
                
        df['SubdomainLevel'] = df['url'].apply(get_level).astype(int)
        return df
    SubdomainLevel(df)  # Chamada fora do bloco def


    def PathLevel(df):
        def count_levels(u):
            try:
                path = urlparse(unquote(u)).path
                return len([p for p in re.split(r'/+', path) if p])
            except:
                return 0
                
        df['PathLevel'] = df['url'].apply(count_levels).astype(int)
        return df
    PathLevel(df)  # Chamada fora do bloco def


    def UrlLength(df):
        df['UrlLength'] = df['url'].apply(
            lambda u: len(str(u)) if isinstance(u, str) else 0
        ).astype(int)
        return df
    UrlLength(df)  # Chamada fora do bloco def


    def NumDash(df):
        """Hifens em toda a URL decodificada"""
        df['NumDash'] = df['url'].apply(lambda u: unquote(u).count('-'))
        return df
    NumDash(df)  # Chamada fora do bloco def


    def NumDashInHostname(df):
        extract = tldextract.TLDExtract()
        def count_dash(u):
            try:
                return extract(u).domain.count('-')
            except:
                return 0
                
        df['NumDashInHostname'] = df['url'].apply(count_dash).astype(int)
        return df
    NumDashInHostname(df)  # Chamada fora do bloco def


    def AtSymbol(df):
        """Símbolo @ em posições suspeitas"""
        df['AtSymbol'] = df['url'].apply(
            lambda u: int(bool(re.search(r'@(?![^/]*/)', unquote(u))))  # Parêntese adicional aqui
        ).astype(int)
        return df
    AtSymbol(df)  # Chamada fora do bloco def


    def TildeSymbol(df):
        """Tilde em contexto suspeito"""
        df['TildeSymbol'] = df['url'].apply(
            lambda u: 1 if re.search(r'~[a-zA-Z0-9]', unquote(u)) else 0
        )
        return df
    TildeSymbol(df)  # Chamada fora do bloco def


    def NumUnderscore(df):
        """Sublinhados em partes relevantes"""
        df['NumUnderscore'] = df['url'].apply(
            lambda u: sum(unquote(u).count('_') for part in urlparse(u)[:3])
        )
        return df
    NumUnderscore(df)  # Chamada fora do bloco def



    def NumQueryComponents(df):
        """Componentes de query únicos"""
        df['NumQueryComponents'] = df['url'].apply(
            lambda u: len(set(parse_qs(urlparse(u).query).keys()))
        )
        return df
    NumQueryComponents(df)  # Chamada fora do bloco def


    def NumAmpersand(df):
        """Ampersands não codificados"""
        df['NumAmpersand'] = df['url'].apply(
            lambda u: unquote(u).count('&') - unquote(u).count('&amp;')
        )
        return df
    NumAmpersand(df)  # Chamada fora do bloco def



    def NumNumericChars(df):
        """Sequências numéricas longas"""
        df['NumNumericChars'] = df['url'].apply(
            lambda u: len(re.findall(r'\d{4,}', unquote(u)))
        )
        return df
    NumNumericChars(df)  # Chamada fora do bloco def


    def NoHttps(df):
        """Protocolo inseguro ou ausente"""
        df['NoHttps'] = df['url'].apply(
            lambda u: 1 if not re.match(r'^https://', u, re.I) else 0
        )
        return df
    NoHttps(df)  # Chamada fora do bloco def


    # def RandomString(df):
    #     def entropy(s):
    #         if not s or len(s) < 2:
    #             return 0
    #         prob = [s.count(c)/len(s) for c in set(s)]
    #         return -sum(p * math.log2(p) for p in prob)
        
    #     def check_random(u):
    #         try:
    #             path = urlparse(u).path
    #             segments = re.split(r'[/\-_]', path)
    #             return int(any(entropy(seg) > 4 for seg in segments if seg))
    #         except:
    #             return 0
                
    #     df['RandomString'] = df['url'].apply(check_random).astype(int)
    #     return df
    # RandomString(df)  # Chamada fora do bloco def


    def IpAddress(df):
        """Endereços IPv4/IPv6 válidos"""
        def is_ip(host):
            try:
                ipaddress.ip_address(host.split(':')[0])
                return 1
            except:
                return 0
        df['IpAddress'] = df['url'].apply(
            lambda u: is_ip(urlparse(u).hostname) if urlparse(u).hostname else 0
        )
        return df
    IpAddress(df)  # Chamada fora do bloco def





    def HostnameLength(df):
        """Comprimento do domínio registrado"""
        extract = tldextract.TLDExtract()
        df['HostnameLength'] = df['url'].apply(
            lambda u: len(extract(u).fqdn)
        )
        return df
    HostnameLength(df)  # Chamada fora do bloco def


    def PathLength(df):
        """Comprimento do caminho normalizado"""
        df['PathLength'] = df['url'].apply(
            lambda u: len(re.sub(r'/+', '/', urlparse(u).path))
        )
        return df
    PathLength(df)  # Chamada fora do bloco def


    def QueryLength(df):
        """Tamanho da query após decodificação"""
        df['QueryLength'] = df['url'].apply(
            lambda u: len(unquote(urlparse(u).query))
        )
        return df
    QueryLength(df)  # Chamada fora do bloco def


    def DoubleSlashInPath(df):
        """Barras duplas após normalização"""
        df['DoubleSlashInPath'] = df['url'].apply(
            lambda u: 1 if '//' in re.sub(r'https?://', '', u) else 0
        )
        return df
    DoubleSlashInPath(df)  # Chamada fora do bloco def


    def NumSensitiveWords(df):
        """Detecção expandida com 100+ padrões de phishing e variações"""
        phishing_keywords = re.compile(r'''
            (ph[i1!]sh[i1!]ng|urgent[ei1]|alert[a4@]|updat[ea@]|senh[a4@]|p@ssw[o0]rd|
            verif[iy][a4@]?c[a4@][o0]|acc[o0]unt|s[3e]cur[i1!]ty|c[o0]nfirm|susp[e3]nd|
            l[o0]ck[3e]d?[o0]ut?|val[i1!]d[a4@]te|id[3e]nt[i1!]ty|s[o0]c[i1!][a4@]l[\-_]s[3e]c|
            cr[e3]d[i1!]t[\-_]c[a4@]rd|ssn|irs|p[a4@]y[o0]ut|r[e3]fund|l[i1!]m[i1!]ted[t1!]ime|
            [a4@]ct[i1!][o0]nreq[uü]ired|dhl|fedex|ups|tr[a4@]ck[i1!]ng|l[o0]g[i1!]n|s[3e]cur[3e]|
            [a4@]dm[i1!]n|b[a4@]nk[i1!]ng|p[a4@]yp[a4@]l|h[o0]mep[a4@]ge|w[i1!]r[e3]|cl[i1!]ck[_\-]h[e3]r[e3]|
            unsubscr[i1!]b[e3]|pr[i1!]z[e3]|w[i1!]nn[e3]r|b[i1!]t[c]?[o0][i1!]n|w[e3]b[_\-]?s[i1!]t[e3]|
            [a4@]uth[3e]nt[i1!]c[a4@]t[i1!][o0]n|br[o0]k[e3]n|f[o0]rm|h[a4@]ck|m[a4@][i1!]l|r[3e]s[3e]t|
            \b(?:[s5][e3]x|v[i1!][a4@]gr[a4@]|p[o0]rn)\b  # Conteúdo adulto comum em phishing
        )''', re.VERBOSE | re.IGNORECASE)
        
        df['NumSensitiveWords'] = df['url'].apply(
            lambda u: len(phishing_keywords.findall(unquote(u).lower()))
        )
        return df
    NumSensitiveWords(df)  # Chamada fora do bloco def


    def EmbeddedBrandName(df):
        """Marcas com detecção de homógrafos"""
        homoglyphs = {
            'a': '[aаⓐ]', 'e': '[eеⓔ]', 'i': '[iіⓘ]',
            'o': '[oоⓞ]', 's': '[sѕⓢ]', 'g': '[gɡⓖ]'
        }
        
        brands = {
            'paypal': ''.join(homoglyphs.get(c, c) for c in 'paypal'),
            'google': ''.join(homoglyphs.get(c, c) for c in 'google'),
            'amazon': ''.join(homoglyphs.get(c, c) for c in 'amazon')
        }
        
        df['EmbeddedBrandName'] = df['url'].apply(
            lambda u: 1 if any(re.search(pattern, unquote(u), re.I) for pattern in brands.values()) else 0
        )
        return df
    EmbeddedBrandName(df)  # Chamada fora do bloco def


    def NumConsecutiveRepeats(df):
        """Detecta sequências repetitivas de 3+ caracteres (letras ou números)"""
        pattern = re.compile(
            r'([a-z])\1{2,}|(\d)\2{2,}',
            re.IGNORECASE
        )
        
        df['NumConsecutiveRepeats'] = df['url'].apply(
            lambda u: len(pattern.findall(unquote(u).lower()))
        ).astype(int)
        return df
    NumConsecutiveRepeats(df)  # Chamada fora do bloco def

    # Função para calcular entropia
    def entropia(texto):
        if not texto:
            return 0

        contador = Counter(texto)
        total = len(texto)
        return -sum((count / total) * math.log2(count / total) for count in contador.values())


    def entropia_dominio(df):
        entropias = []

        for url in df['url']:
            entropias.append(entropia(url))

        df['entropia_dominio'] = entropias
        return df

    entropia_dominio(df)

    def AlphanumericBalance(df):
        def calculate_balance(url):
            domain = urlparse(url).netloc
            letters = sum(c.isalpha() for c in domain)
            digits = sum(c.isdigit() for c in domain)
            return (letters - digits) / len(domain) if domain else 0  # Domínios legítimos têm mais letras
        
        df['AlphaNumBalance'] = df['url'].apply(calculate_balance)
        return df
    AlphanumericBalance(df)





    def SuspiciousFileExtension(df):
        """Extensões de arquivo suspeitas no caminho"""
        dangerous_ext = re.compile(r'''
            \.(php|exe|js|jar|py|pl|sh|bat|cmd|dll|bin|vb|vbs|
            jsp|asp|aspx|html?|swf|htaccess|wsf|scr|msi|lnk|reg
        )(?:\?|$|/)''', re.VERBOSE | re.IGNORECASE)
        
        df['SuspiciousFileExtension'] = df['url'].apply(
            lambda u: 1 if dangerous_ext.search(urlparse(u).path) else 0
        ).astype('int8')
        return df
    SuspiciousFileExtension(df)




    def ParameterKeywords(df):
        """Parâmetros de query suspeitos"""
        suspicious_params = re.compile(r'''
            (cmd|exec|shell|wget|curl|download|config|settings|
            pass|hash|key|token|auth|admin|debug|test|php|\.\.)
        ''', re.VERBOSE | re.IGNORECASE)
        
        df['ParameterKeywords'] = df['url'].apply(
            lambda u: len(suspicious_params.findall(urlparse(u).query))
        ).astype('int8')
        return df
    ParameterKeywords(df)



    # def QueryParameterCount(df):
    #     """Número de parâmetros na query string"""
    #     df['QueryParameterCount'] = df['url'].apply(
    #         lambda u: len(parse_qs(urlparse(u).query))
    #     ).astype('int16')
    #     return df
    # QueryParameterCount(df)



    def TLDType(df):
        """TLDs de países vs genéricos"""
        country_tlds = {'br','us','cn','ru','in','uk','fr','de','jp','kr','es','id'}
        
        def check_tld(u):
            tld = tldextract.extract(u).suffix.split('.')[-1]
            return 1 if tld in country_tlds else 0
        
        df['TLDType'] = df['url'].apply(check_tld).astype('int8')
        return df
    TLDType(df)

    def SubdomainLengthVariation(df):
        """Variação no tamanho dos subdomínios"""
        extract = tldextract.TLDExtract()
        
        def calc_variation(u):
            subdomains = extract(u).subdomain.split('.')
            lengths = [len(s) for s in subdomains if s]
            return max(lengths) - min(lengths) if lengths else 0
        
        df['SubdomainLengthVariation'] = df['url'].apply(calc_variation).astype('int8')
        return df
    SubdomainLengthVariation(df)

    def RepeatedPathSegments(df):
        """Segmentos de caminho repetidos"""
        def find_repeats(u):
            path = urlparse(u).path
            segments = [s for s in re.split(r'/+', path) if s]
            return 1 if len(segments) != len(set(segments)) else 0
        
        df['RepeatedPathSegments'] = df['url'].apply(find_repeats).astype('int8')
        return df
    RepeatedPathSegments(df)



    def ConsonantRatio(df):
        """Proporção de consoantes/vogais no domínio"""
        def calc_ratio(u):
            domain = tldextract.extract(u).domain.lower()
            vowels = sum(1 for c in domain if c in 'aeiou')
            consonants = len(domain) - vowels
            return consonants / len(domain) if domain else 0
        
        df['ConsonantRatio'] = df['url'].apply(calc_ratio).round(2)
        return df
    ConsonantRatio(df)

    def AuthInPath(df):
        """Termos de autenticação no caminho"""
        auth_terms = re.compile(r'''
            (login|signin|auth|authentication|session|token|
            oauth|sso|passport|credential|register|signup)
        ''', re.VERBOSE | re.IGNORECASE)
        
        df['AuthInPath'] = df['url'].apply(
            lambda u: 1 if auth_terms.search(urlparse(u).path) else 0
        ).astype('int8')
        return df
    AuthInPath(df)


    def DomainDigits(df):
        """Número de dígitos no domínio principal"""
        df['DomainDigits'] = df['url'].apply(
            lambda u: sum(c.isdigit() for c in tldextract.extract(u).domain)
        ).astype('int8')
        return df
    DomainDigits(df)


    def ObfuscatedStrings(df):
        """Strings ofuscadas (hex, base64, etc)"""
        obfuscated = re.compile(r'''
            (\\x[0-9a-f]{2}|%[0-9a-f]{2}|
            [a-z0-9+/]{40,}={0,2}|  # Base64
            \d{2,}\.\d{2,}\.\d{2,}) # IP decimal
        ''', re.VERBOSE | re.I)
        
        df['ObfuscatedStrings'] = df['url'].apply(
            lambda u: len(obfuscated.findall(unquote(u)))
        ).astype('int8')
        return df
    ObfuscatedStrings(df)
    

    def TfIdfScore(df, ngram_range=(3,5), max_features=5000):
        """
        Extrai uma coluna 'TfIdfScore' que representa a soma dos pesos TF-IDF
        de cada URL no DataFrame, sem acessar a página.
        
        Parâmetros:
            df (pd.DataFrame): DataFrame contendo coluna 'url' com URLs a analisar.
            ngram_range (tuple): intervalo de n-grams de caracteres para TF-IDF.
            max_features (int): número máximo de features TF-IDF.
        
        Retorna:
            pd.DataFrame: mesmo DataFrame com a nova coluna 'TfIdfScore'.
        """
        # Configura o vetor TF-IDF para char-ngrams
        vectorizer = TfidfVectorizer(
            analyzer='char_wb',
            ngram_range=ngram_range,
            max_features=max_features,
            lowercase=False
        )
        
        # Ajusta o vetor ao nosso corpus de URLs e transforma
        tfidf_matrix = vectorizer.fit_transform(df['url'].astype(str))
        
        # Soma dos pesos TF-IDF por URL (linha)
        df['TfIdfScore'] = tfidf_matrix.sum(axis=1).A1
        
        return df

    # Exemplo de uso (fora do bloco def)
    TfIdfScore(df)

    df.drop(columns=['url'], inplace=True)
    
    print(df)

    return df