using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Mission11_Nemet.API.Data
{
    public class BooksDbContext : DbContext
    {
        public BooksDbContext(DbContextOptions<BooksDbContext> options) : base(options)
        {
        }
        // This line tells Entity Framework that there is a table called 'Books' (yes, plural)
        // in the database, and that the data will be mapped to 'Book' C# objects.
        public DbSet<Books> Books { get; set; }
    }
}
