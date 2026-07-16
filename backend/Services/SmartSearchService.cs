using System.Text.Json;

namespace MangaWeb.Backend.Services;

public class SmartSearchResult
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string MainCharacter { get; set; } = string.Empty;
    public string CoverUrl { get; set; } = string.Empty;
    public List<string> Genres { get; set; } = new();
    public double Rating { get; set; }
    public int Chapters { get; set; }
}

public class SmartSearchService
{
    private readonly HttpClient _http;

    private static readonly Dictionary<string, string> TagTranslations = new(StringComparer.OrdinalIgnoreCase)
    {
        {"Action", "Экшен"}, {"Adventure", "Приключения"}, {"Comedy", "Комедия"},
        {"Drama", "Драма"}, {"Fantasy", "Фэнтези"}, {"Horror", "Ужасы"},
        {"Mecha", "Меха"}, {"Mystery", "Мистика"}, {"Psychological", "Психология"},
        {"Romance", "Романтика"}, {"Sci-Fi", "Фантастика"}, {"Slice of Life", "Повседневность"},
        {"Sports", "Спорт"}, {"Supernatural", "Сверхъестественное"}, {"Tragedy", "Трагедия"},
        {"Martial Arts", "Боевые искусства"}, {"Long Strip", "Веб-комикс"}, {"Harem", "Гарем"},
        {"Wuxia", "Уся"}, {"School Life", "Школа"}, {"Magic", "Магия"},
        {"Isekai", "Исекай"}, {"Reincarnation", "Перерождение"}, {"Time Travel", "Путешествие во времени"},
        {"Demons", "Демоны"}, {"Vampires", "Вампиры"}, {"Monsters", "Монстры"},
        {"Survival", "Выживание"}, {"System", "Система"}, {"Adaptation", "Адаптация"},
        {"Full Color", "В цвете"}, {"Web Comic", "Веб-комикс"}
    };

    public SmartSearchService(HttpClient http)
    {
        _http = http;
    }

    private bool IsMatch(string query, string titleRu, string titleEn, JsonElement? altTitles = null)
    {
        var q = query.ToLower();
        if (!string.IsNullOrEmpty(titleRu) && titleRu.ToLower().Contains(q)) return true;
        if (!string.IsNullOrEmpty(titleEn) && titleEn.ToLower().Contains(q)) return true;
        if (altTitles.HasValue && altTitles.Value.ValueKind == JsonValueKind.Array)
        {
            foreach (var alt in altTitles.Value.EnumerateArray())
            {
                if (alt.ValueKind == JsonValueKind.Object)
                {
                    foreach (var prop in alt.EnumerateObject())
                    {
                        if (prop.Value.GetString()?.ToLower().Contains(q) == true) return true;
                    }
                }
                else if (alt.ValueKind == JsonValueKind.String)
                {
                    if (alt.GetString()?.ToLower().Contains(q) == true) return true;
                }
            }
        }
        return false;
    }

    public async Task<SmartSearchResult> SearchAsync(string query)
    {
        var result = new SmartSearchResult { Title = query };

        var shikiTask = SearchShikimori(query);
        var dexTask = SearchMangaDex(query);
        var remangaTask = SearchRemanga(query);

        await Task.WhenAll(shikiTask, dexTask, remangaTask);

        var shikiData = await shikiTask;
        var dexData = await dexTask;
        var remangaData = await remangaTask;

        var allGenres = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        if (shikiData?.Genres != null) foreach(var g in shikiData.Genres) allGenres.Add(g);
        if (dexData?.Genres != null) foreach(var g in dexData.Genres) allGenres.Add(g);
        if (remangaData?.Genres != null) foreach(var g in remangaData.Genres) allGenres.Add(g);
        
        result.Genres = allGenres
            .Where(g => !string.IsNullOrWhiteSpace(g) && g != "Sexual Violence")
            .ToList();

        var descriptions = new[] { shikiData?.Description, dexData?.Description, remangaData?.Description }
            .Where(d => !string.IsNullOrWhiteSpace(d))
            .OrderByDescending(d => d!.Length)
            .ToList();
        
        result.Description = System.Net.WebUtility.HtmlDecode(descriptions.FirstOrDefault() ?? string.Empty);

        result.Author = new[] { dexData?.Author, shikiData?.Author, remangaData?.Author }
            .FirstOrDefault(a => !string.IsNullOrWhiteSpace(a)) ?? string.Empty;
        
        result.MainCharacter = new[] { remangaData?.MainCharacter, shikiData?.MainCharacter, dexData?.MainCharacter }
            .FirstOrDefault(a => !string.IsNullOrWhiteSpace(a)) ?? string.Empty;

        result.CoverUrl = shikiData?.CoverUrl ?? remangaData?.CoverUrl ?? string.Empty;
        result.Rating = shikiData?.Rating > 0 ? shikiData.Rating : (remangaData?.Rating ?? 0);
        result.Chapters = shikiData?.Chapters > 0 ? shikiData.Chapters : (remangaData?.Chapters ?? 0);

        if (string.IsNullOrEmpty(result.Title))
        {
            result.Title = remangaData?.Title ?? shikiData?.Title ?? dexData?.Title ?? query;
        }

        return result;
    }

    private async Task<SmartSearchResult?> SearchShikimori(string query)
    {
        try
        {
            var req = new HttpRequestMessage(HttpMethod.Get, $"https://shikimori.one/api/mangas?search={Uri.EscapeDataString(query)}&limit=1");
            req.Headers.Add("User-Agent", "MangaWeb/1.0");
            var res = await _http.SendAsync(req);
            if (!res.IsSuccessStatusCode) return null;

            using var doc = JsonDocument.Parse(await res.Content.ReadAsStringAsync());
            if (doc.RootElement.GetArrayLength() == 0) return null;

            var manga = doc.RootElement[0];
            var titleRu = manga.GetProperty("russian").GetString();
            var titleEn = manga.GetProperty("name").GetString();
            
            if (!IsMatch(query, titleRu ?? "", titleEn ?? "")) return null;

            var id = manga.GetProperty("id").GetInt32();
            
            var detailReq = new HttpRequestMessage(HttpMethod.Get, $"https://shikimori.one/api/mangas/{id}");
            detailReq.Headers.Add("User-Agent", "MangaWeb/1.0");
            var detailRes = await _http.SendAsync(detailReq);
            
            if (!detailRes.IsSuccessStatusCode) return null;
            using var detailDoc = JsonDocument.Parse(await detailRes.Content.ReadAsStringAsync());
            var root = detailDoc.RootElement;

            var result = new SmartSearchResult();
            result.Title = !string.IsNullOrEmpty(titleRu) ? titleRu : titleEn!;

            if (root.TryGetProperty("description", out var desc))
                result.Description = desc.GetString()?.Replace("[i]", "").Replace("[/i]", "").Replace("[b]", "").Replace("[/b]", "") ?? "";

            if (root.TryGetProperty("score", out var scoreStr))
            {
                if (double.TryParse(scoreStr.GetString(), out var score))
                    result.Rating = Math.Round(score / 2.0, 1);
            }

            if (root.TryGetProperty("chapters", out var chaps)) result.Chapters = chaps.GetInt32();
            if (result.Chapters == 0 && root.TryGetProperty("volumes", out var vols)) result.Chapters = vols.GetInt32();

            if (root.TryGetProperty("image", out var img) && img.TryGetProperty("original", out var origImg))
                result.CoverUrl = "https://shikimori.one" + origImg.GetString();

            if (root.TryGetProperty("genres", out var genres))
            {
                foreach (var g in genres.EnumerateArray())
                {
                    if (g.TryGetProperty("russian", out var gr) && !string.IsNullOrEmpty(gr.GetString()))
                        result.Genres.Add(gr.GetString()!);
                    else if (g.TryGetProperty("name", out var gn))
                        result.Genres.Add(gn.GetString()!);
                }
            }
            return result;
        }
        catch { return null; }
    }

    private async Task<SmartSearchResult?> SearchMangaDex(string query)
    {
        try
        {
            var req = new HttpRequestMessage(HttpMethod.Get, $"https://api.mangadex.org/manga?title={Uri.EscapeDataString(query)}&limit=1&includes[]=author");
            req.Headers.Add("User-Agent", "MangaWeb/1.0");
            var res = await _http.SendAsync(req);
            if (!res.IsSuccessStatusCode) return null;

            using var doc = JsonDocument.Parse(await res.Content.ReadAsStringAsync());
            if (!doc.RootElement.TryGetProperty("data", out var data) || data.GetArrayLength() == 0) return null;

            var manga = data[0];
            var attrs = manga.GetProperty("attributes");
            
            var titleEn = attrs.TryGetProperty("title", out var t) && t.TryGetProperty("en", out var enT) ? enT.GetString() : "";
            var altTitles = attrs.TryGetProperty("altTitles", out var alt) ? alt : (JsonElement?)null;
            
            if (!IsMatch(query, "", titleEn ?? "", altTitles)) return null;

            var result = new SmartSearchResult();
            result.Title = titleEn ?? "";

            if (attrs.TryGetProperty("description", out var descObj))
            {
                if (descObj.TryGetProperty("ru", out var ruDesc)) result.Description = ruDesc.GetString() ?? "";
                else if (descObj.TryGetProperty("en", out var enDesc)) result.Description = enDesc.GetString() ?? "";
            }

            if (attrs.TryGetProperty("tags", out var tags))
            {
                foreach (var tg in tags.EnumerateArray())
                {
                    if (tg.TryGetProperty("attributes", out var tAttr) && tAttr.TryGetProperty("name", out var tName))
                    {
                        if (tName.TryGetProperty("en", out var enTag))
                        {
                            var tagStr = enTag.GetString();
                            if (!string.IsNullOrEmpty(tagStr))
                            {
                                // Игнорируем технические теги формата
                                if (tagStr == "Long Strip" || tagStr == "Full Color" || tagStr == "Web Comic" || tagStr == "Adaptation") continue;

                                if (TagTranslations.TryGetValue(tagStr, out var ruTag)) result.Genres.Add(ruTag);
                                else result.Genres.Add(tagStr);
                            }
                        }
                    }
                }
            }

            if (manga.TryGetProperty("relationships", out var rels))
            {
                foreach (var r in rels.EnumerateArray())
                {
                    if (r.TryGetProperty("type", out var type) && type.GetString() == "author")
                    {
                        if (r.TryGetProperty("attributes", out var rAttr) && rAttr.TryGetProperty("name", out var aName))
                        {
                            result.Author = aName.GetString() ?? "";
                            break;
                        }
                    }
                }
            }

            return result;
        }
        catch { return null; }
    }

    private async Task<SmartSearchResult?> SearchRemanga(string query)
    {
        try
        {
            var req = new HttpRequestMessage(HttpMethod.Get, $"https://api.remanga.org/api/search/?query={Uri.EscapeDataString(query)}&count=5");
            req.Headers.Add("User-Agent", "Mozilla/5.0");
            var res = await _http.SendAsync(req);
            if (!res.IsSuccessStatusCode) return null;

            using var doc = JsonDocument.Parse(await res.Content.ReadAsStringAsync());
            if (!doc.RootElement.TryGetProperty("content", out var content) || content.GetArrayLength() == 0) return null;

            JsonElement? matchedManga = null;
            string? matchedDir = null;
            string? matchedTitleRu = null;
            string? matchedTitleEn = null;

            foreach (var manga in content.EnumerateArray())
            {
                var titleRu = manga.GetProperty("rus_name").GetString();
                var titleEn = manga.GetProperty("en_name").GetString();
                
                if (IsMatch(query, titleRu ?? "", titleEn ?? ""))
                {
                    matchedManga = manga;
                    matchedDir = manga.GetProperty("dir").GetString();
                    matchedTitleRu = titleRu;
                    matchedTitleEn = titleEn;
                    break;
                }
            }

            if (matchedDir == null) return null;
            
            var detailReq = new HttpRequestMessage(HttpMethod.Get, $"https://api.remanga.org/api/titles/{matchedDir}/");
            detailReq.Headers.Add("User-Agent", "Mozilla/5.0");
            var detailRes = await _http.SendAsync(detailReq);
            if (!detailRes.IsSuccessStatusCode) return null;

            using var detailDoc = JsonDocument.Parse(await detailRes.Content.ReadAsStringAsync());
            if (!detailDoc.RootElement.TryGetProperty("content", out var dContent)) return null;

            var result = new SmartSearchResult();
            result.Title = !string.IsNullOrEmpty(matchedTitleRu) ? matchedTitleRu : matchedTitleEn!;

            if (dContent.TryGetProperty("description", out var desc))
            {
                var dStr = desc.GetString() ?? "";
                dStr = System.Text.RegularExpressions.Regex.Replace(dStr, "<.*?>", " ");
                dStr = System.Text.RegularExpressions.Regex.Replace(dStr, @"\s+", " ").Trim();
                result.Description = dStr;
            }

            if (dContent.TryGetProperty("genres", out var genres))
            {
                foreach(var g in genres.EnumerateArray())
                    if(g.TryGetProperty("name", out var gName) && !string.IsNullOrEmpty(gName.GetString()))
                        result.Genres.Add(gName.GetString()!);
            }

            if (dContent.TryGetProperty("categories", out var cats))
            {
                foreach(var c in cats.EnumerateArray())
                    if(c.TryGetProperty("name", out var cName) && !string.IsNullOrEmpty(cName.GetString()))
                    {
                        var catStr = cName.GetString()!;
                        if (catStr != "В цвете" && catStr != "Веб" && catStr != "Адаптация" && catStr != "Комикс" && catStr != "Сингл" && catStr != "Сборник")
                            result.Genres.Add(catStr);
                    }
            }


            if (dContent.TryGetProperty("count_chapters", out var chaps))
            {
                if (chaps.ValueKind == JsonValueKind.Number)
                    result.Chapters = chaps.GetInt32();
                else if (chaps.ValueKind == JsonValueKind.String && int.TryParse(chaps.GetString(), out var c))
                    result.Chapters = c;
            }
                
            if (dContent.TryGetProperty("avg_rating", out var rating))
            {
                if (rating.ValueKind == JsonValueKind.Number)
                    result.Rating = Math.Round(rating.GetDouble() / 2.0, 1);
                else if (rating.ValueKind == JsonValueKind.String && double.TryParse(rating.GetString(), System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var rat))
                    result.Rating = Math.Round(rat / 2.0, 1);
            }
            
            if (dContent.TryGetProperty("img", out var img) && img.TryGetProperty("high", out var highImg))
            {
                result.CoverUrl = "https://remanga.org" + highImg.GetString();
            }

            // Remanga sometimes stores MC in a separate characters array, but it requires a different endpoint.
            // Let's leave MainCharacter empty if not found, user can fill it.

            return result;
        }
        catch { return null; }
    }
}
